const Project = require('../models/Project');

function createDefaultStages(costs) {
  return [
    {
      name: 'Land Purchase',
      targetAmount: costs.land,
      collectedAmount: 0,
      status: 'Pending'
    },
    {
      name: 'Foundation Work',
      targetAmount: Math.round(costs.material * 0.25 + costs.equipment * 0.25 + costs.labor * 0.25),
      collectedAmount: 0,
      status: 'Pending'
    },
    {
      name: 'Structure Work',
      targetAmount: Math.round(costs.material * 0.45 + costs.equipment * 0.45 + costs.labor * 0.45),
      collectedAmount: 0,
      status: 'Pending'
    },
    {
      name: 'Finishing and Handover',
      targetAmount: Math.round(costs.material * 0.30 + costs.equipment * 0.30 + costs.labor * 0.30 + costs.permit),
      collectedAmount: 0,
      status: 'Pending'
    }
  ];
}

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      name,
      location,
      projectType,
      description,
      image,
      landPrice,
      materialCost,
      equipmentCost,
      laborCost,
      permitCost,
      contingencyPercent,
      investorCount,
      transactions
    } = req.body;

    if (!name || !location || !projectType || !description) {
      return res.status(400).json({ message: 'Name, location, type and description are required' });
    }

    const land = Number(landPrice) || 0;
    const material = Number(materialCost) || 0;
    const equipment = Number(equipmentCost) || 0;
    const labor = Number(laborCost) || 0;
    const permit = Number(permitCost) || 0;
    const contingency = Number(contingencyPercent) || 0;
    const investors = Number(investorCount) || 0;

    const directCost = land + material + equipment + labor + permit;
    if (directCost <= 0) {
      return res.status(400).json({ message: 'Project cost must be greater than zero' });
    }

    const estimatedPrice = Math.round(directCost + (directCost * contingency / 100));
    const stages = createDefaultStages({ land, material, equipment, labor, permit });
    const savedTransactions = Array.isArray(transactions) ? transactions : [];
    const totalCollected = savedTransactions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const totalProjects = await Project.countDocuments();
    const project = new Project({
      name,
      projectId: `BP-${String(totalProjects + 1).padStart(4, '0')}`,
      location,
      projectType,
      status: 'Upcoming',
      description,
      image,
      budgetBDT: estimatedPrice,
      landPrice: land,
      materialCost: material,
      equipmentCost: equipment,
      laborCost: labor,
      permitCost: permit,
      contingencyPercent: contingency,
      estimatedPrice,
      investorCount: investors,
      landPaymentPerInvestor: investors ? Math.round(land / investors) : 0,
      totalCollected,
      stages,
      transactions: savedTransactions,
      progressPercentage: 0,
      startDate: new Date(),
      expectedCompletionDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const allowed = [
      'name', 'location', 'projectType', 'description', 'image',
      'status', 'progressPercentage',
      'landPrice', 'materialCost', 'equipmentCost', 'laborCost',
      'permitCost', 'contingencyPercent', 'investorCount',
      'startDate', 'expectedCompletionDate'
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Recalculate estimated price if cost fields changed
    const land = Number(project.landPrice) || 0;
    const material = Number(project.materialCost) || 0;
    const equipment = Number(project.equipmentCost) || 0;
    const labor = Number(project.laborCost) || 0;
    const permit = Number(project.permitCost) || 0;
    const contingency = Number(project.contingencyPercent) || 0;
    const investors = Number(project.investorCount) || 0;

    const directCost = land + material + equipment + labor + permit;
    if (directCost > 0) {
      project.estimatedPrice = Math.round(directCost + (directCost * contingency / 100));
      project.budgetBDT = project.estimatedPrice;
      project.landPaymentPerInvestor = investors ? Math.round(land / investors) : 0;
    }

    // Clamp progressPercentage
    if (project.progressPercentage !== undefined) {
      project.progressPercentage = Math.min(100, Math.max(0, Number(project.progressPercentage)));
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { investorName, stageName, amount, note } = req.body;

    if (!investorName || !stageName || !amount) {
      return res.status(400).json({ message: 'Investor name, stage and amount are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const paidAmount = Number(amount) || 0;
    if (paidAmount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be greater than zero' });
    }

    project.transactions.push({ investorName, stageName, amount: paidAmount, note });
    project.totalCollected = (project.totalCollected || 0) + paidAmount;

    const stage = project.stages.find(item => item.name === stageName);
    if (stage) {
      stage.collectedAmount = (stage.collectedAmount || 0) + paidAmount;
      stage.status = stage.collectedAmount >= stage.targetAmount ? 'Completed' : 'Collecting';
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
