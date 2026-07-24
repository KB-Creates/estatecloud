import prisma from '../lib/prisma.js';

// @desc    Get Platform SaaS Overview Stats
// @route   GET /api/super-admin/stats
// @access  Private (Super Admin)
export const getPlatformStats = async (req, res) => {
  try {
    const totalCompanies = await prisma.company.count();
    const activeCompanies = await prisma.company.count({ where: { status: 'Active' } });
    const totalProperties = await prisma.property.count();
    const totalUsers = await prisma.user.count({ where: { role: { not: 'superadmin' } } });
    
    // Fetch all companies with plans to calculate estimated ARR/MRR
    const companies = await prisma.company.findMany({
      include: { plan: true }
    });

    let mrr = 0;
    companies.forEach(company => {
      if (company.plan && company.subscriptionStatus === 'Active') {
        mrr += company.plan.priceMonthly || 0;
      }
    });
    const arr = mrr * 12;

    const planDistribution = await prisma.company.groupBy({
      by: ['planId'],
      _count: { id: true }
    });

    const plans = await prisma.subscriptionPlan.findMany();
    const planStats = plans.map(plan => {
      const dist = planDistribution.find(d => d.planId === plan.id);
      return {
        id: plan.id,
        name: plan.name,
        count: dist ? dist._count.id : 0
      };
    });

    res.json({
      totalCompanies,
      activeCompanies,
      totalProperties,
      totalUsers,
      mrr,
      arr,
      planStats
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Companies / Tenants
// @route   GET /api/super-admin/companies
// @access  Private (Super Admin)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            properties: true,
            units: true,
            contracts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Company Status
// @route   PATCH /api/super-admin/companies/:id/status
// @access  Private (Super Admin)
export const updateCompanyStatus = async (req, res) => {
  const { id } = req.params;
  const { status, subscriptionStatus } = req.body;

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(subscriptionStatus && { subscriptionStatus })
      },
      include: { plan: true }
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Company Subscription Plan
// @route   PATCH /api/super-admin/companies/:id/plan
// @access  Private (Super Admin)
export const updateCompanyPlan = async (req, res) => {
  const { id } = req.params;
  const { planId } = req.body;

  try {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ message: 'Subscription Plan not found' });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        planId: plan.id,
        subscriptionStatus: 'Active'
      },
      include: { plan: true }
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Subscription Plans
// @route   GET /api/super-admin/plans
// @access  Public / Private
export const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' }
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a Subscription Plan
// @route   POST /api/super-admin/plans
// @access  Private (Super Admin)
export const createPlan = async (req, res) => {
  const { name, slug, description, priceMonthly, priceYearly, maxProperties, maxStaff, maxUnits, features, isPopular } = req.body;

  try {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        priceMonthly: parseFloat(priceMonthly) || 0,
        priceYearly: parseFloat(priceYearly) || 0,
        maxProperties: parseInt(maxProperties) || 10,
        maxStaff: parseInt(maxStaff) || 3,
        maxUnits: parseInt(maxUnits) || 50,
        features: Array.isArray(features) ? features : [],
        isPopular: !!isPopular
      }
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Subscription Plan
// @route   PUT /api/super-admin/plans/:id
// @access  Private (Super Admin)
export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, priceMonthly, priceYearly, maxProperties, maxStaff, maxUnits, features, isPopular } = req.body;

  try {
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        description,
        priceMonthly: parseFloat(priceMonthly),
        priceYearly: parseFloat(priceYearly),
        maxProperties: parseInt(maxProperties),
        maxStaff: parseInt(maxStaff),
        maxUnits: parseInt(maxUnits),
        features: Array.isArray(features) ? features : undefined,
        isPopular: isPopular !== undefined ? !!isPopular : undefined
      }
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
