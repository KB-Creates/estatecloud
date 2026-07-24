import prisma from '../lib/prisma.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

// Create Payroll entry
export const createPayroll = async (req, res) => {
  try {
    const { staffId, month, year, baseSalary, bonus, deductions, status, paymentMethod, notes } = req.body;

    const existingPayroll = await prisma.payroll.findFirst({
      where: { staffId, month, year: Number(year) }
    });
    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already exists for this staff in the selected month and year' });
    }

    const totalAmount = Number(baseSalary) + Number(bonus || 0) - Number(deductions || 0);

    const payroll = await prisma.payroll.create({
      data: {
        staffId,
        month,
        year: Number(year),
        baseSalary: Number(baseSalary),
        bonus: Number(bonus || 0),
        deductions: Number(deductions || 0),
        totalAmount,
        status: status || 'Pending',
        paymentMethod: paymentMethod || 'Bank Transfer',
        notes: notes || null,
        paymentDate: status === 'Paid' ? new Date() : null,
        createdById: req.user.id,
      }
    });

    res.status(201).json(fmt(payroll));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        staff: { select: { id: true, name: true, email: true, designation: true, basicSalary: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(payrolls.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const payroll = await prisma.payroll.findUnique({
      where: { id: req.params.id },
      include: {
        staff: { select: { id: true, name: true, email: true, designation: true, basicSalary: true } }
      }
    });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    res.status(200).json(fmt(payroll));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payroll
export const updatePayroll = async (req, res) => {
  try {
    const existing = await prisma.payroll.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Payroll not found' });

    const { status, bonus, deductions, baseSalary } = req.body;

    const newBaseSalary = baseSalary !== undefined ? Number(baseSalary) : existing.baseSalary;
    const newBonus = bonus !== undefined ? Number(bonus) : existing.bonus;
    const newDeductions = deductions !== undefined ? Number(deductions) : existing.deductions;
    const totalAmount = newBaseSalary + newBonus - newDeductions;

    const payroll = await prisma.payroll.update({
      where: { id: req.params.id },
      data: {
        status: status || existing.status,
        baseSalary: newBaseSalary,
        bonus: newBonus,
        deductions: newDeductions,
        totalAmount,
        paymentDate: status === 'Paid' && !existing.paymentDate ? new Date() : existing.paymentDate,
      }
    });
    res.status(200).json(fmt(payroll));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payroll
export const deletePayroll = async (req, res) => {
  try {
    const payroll = await prisma.payroll.findUnique({ where: { id: req.params.id } });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    await prisma.payroll.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll stats
export const getPayrollStats = async (req, res) => {
  try {
    const [paidStats, pendingStats, count] = await Promise.all([
      prisma.payroll.aggregate({
        where: { status: 'Paid' },
        _sum: { totalAmount: true }
      }),
      prisma.payroll.aggregate({
        where: { status: 'Pending' },
        _sum: { totalAmount: true }
      }),
      prisma.payroll.count()
    ]);

    res.status(200).json({
      totalPaid: paidStats._sum.totalAmount || 0,
      totalPending: pendingStats._sum.totalAmount || 0,
      count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
