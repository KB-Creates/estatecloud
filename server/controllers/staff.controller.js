import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const fmt = (obj) => {
  if (!obj) return null;
  const { id, password, ...rest } = obj;
  return { _id: id, ...rest };
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, designation, basicSalary, status } = req.body;

    // Check SaaS Staff Limit
    if (!req.isSuperAdmin && req.user.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: req.user.companyId },
        include: { plan: true }
      });
      if (company && company.plan) {
        const staffCount = await prisma.user.count({
          where: {
            companyId: req.user.companyId,
            role: { in: ['companyadmin', 'manager', 'agent', 'staff'] }
          }
        });
        if (staffCount >= company.plan.maxStaff) {
          return res.status(403).json({
            message: `Staff member limit reached (${staffCount}/${company.plan.maxStaff}) for plan "${company.plan.name}". Please upgrade your subscription.`
          });
        }
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const rawPass = password || 'staff123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPass, salt);

    const staff = await prisma.user.create({
      data: {
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@company.com`,
        password: hashedPassword,
        role: 'staff',
        phone: phone || null,
        designation: designation || null,
        basicSalary: Number(basicSalary || 0),
        status: status || 'Active',
        createdById: req.user.id,
        companyId: req.user.companyId || null,
      }
    });

    res.status(201).json(fmt(staff));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    const where = { role: 'staff' };
    if (!req.isSuperAdmin && req.user.companyId) {
      where.companyId = req.user.companyId;
    } else {
      where.createdById = req.user.id;
    }

    const staff = await prisma.user.findMany({
      where,
      omit: { password: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(staff.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { name, email, phone, designation, basicSalary, status } = req.body;

    const staffMember = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!staffMember || staffMember.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: name || staffMember.name,
        email: email || staffMember.email,
        phone: phone !== undefined ? phone : staffMember.phone,
        designation: designation !== undefined ? designation : staffMember.designation,
        basicSalary: basicSalary !== undefined ? Number(basicSalary) : staffMember.basicSalary,
        status: status || staffMember.status,
      },
      omit: { password: true }
    });

    res.json(fmt(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staffMember = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!staffMember || staffMember.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const payrollCount = await prisma.payroll.count({ where: { staffId: req.params.id } });
    if (payrollCount > 0) {
      return res.status(400).json({
        message: `Cannot delete staff member. They have ${payrollCount} linked payroll records. Please delete records first.`
      });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
