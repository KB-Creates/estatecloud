import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new Company / Tenant on EstateCloud SaaS
// @route   POST /api/companies/register
// @access  Public
export const registerCompany = async (req, res) => {
  const {
    companyName,
    slug,
    phone,
    address,
    adminName,
    adminEmail,
    adminPassword,
    planSlug = 'starter'
  } = req.body;

  try {
    if (!companyName || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const generateSlug = slug || companyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // Check if company slug or admin email exists
    const existingCompany = await prisma.company.findUnique({ where: { slug: generateSlug } });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company name/slug already registered. Please choose a different name.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'User email already registered.' });
    }

    // Find selected Subscription Plan
    const plan = await prisma.subscriptionPlan.findUnique({ where: { slug: planSlug } });
    if (!plan) {
      return res.status(400).json({ message: `Invalid subscription plan: ${planSlug}` });
    }

    // Create Company Tenant
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: generateSlug,
        email: adminEmail,
        phone: phone || null,
        address: address || null,
        status: 'Active',
        subscriptionStatus: 'Active',
        planId: plan.id,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14-day trial default
      }
    });

    // Create Company Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const user = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'companyadmin',
        companyName: companyName,
        companyId: company.id,
        status: 'Active'
      }
    });

    // Initialize Default Settings for this company
    await prisma.setting.create({
      data: {
        storeName: companyName,
        email: adminEmail,
        phone: phone || '+923000000000',
        address: address || 'Lahore, Pakistan',
        userId: user.id,
        companyId: company.id
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: company.id,
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        plan: plan.name
      },
      token
    });
  } catch (error) {
    console.error('Register Company Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Current Company Details & Subscription Limits
// @route   GET /api/companies/current
// @access  Private
export const getCurrentCompany = async (req, res) => {
  try {
    if (!req.user.companyId) {
      return res.status(404).json({ message: 'No company associated with this user' });
    }

    const company = await prisma.company.findUnique({
      where: { id: req.user.companyId },
      include: {
        plan: true,
        _count: {
          select: {
            properties: true,
            units: true,
            users: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Staff count excludes customers/tenants
    const staffCount = await prisma.user.count({
      where: {
        companyId: req.user.companyId,
        role: { in: ['companyadmin', 'manager', 'agent', 'staff'] }
      }
    });

    res.json({
      ...company,
      usage: {
        propertiesCount: company._count.properties,
        maxProperties: company.plan?.maxProperties || 10,
        staffCount,
        maxStaff: company.plan?.maxStaff || 3,
        unitsCount: company._count.units,
        maxUnits: company.plan?.maxUnits || 50
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Tenant Company Profile
// @route   PUT /api/companies/current
// @access  Private (Company Admin / Manager)
export const updateCompanyProfile = async (req, res) => {
  const { name, logo, phone, email, address, taxId } = req.body;

  try {
    if (!req.user.companyId) {
      return res.status(400).json({ message: 'No company associated with user' });
    }

    const company = await prisma.company.update({
      where: { id: req.user.companyId },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(taxId !== undefined && { taxId })
      },
      include: { plan: true }
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
