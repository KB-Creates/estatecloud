import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

const genRefNumber = () => 'EXP-' + Math.floor(100000 + Math.random() * 900000);

export const createExpense = async (req, res) => {
  try {
    const body = { ...req.body };

    const expense = await prisma.expense.create({
      data: {
        title: body.title,
        category: body.category,
        amount: Number(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        paymentMethod: body.paymentMethod || 'Cash',
        notes: body.notes || null,
        status: body.status || 'Paid',
        referenceNumber: genRefNumber(),
        createdById: req.user.id,
        propertyId: body.property || body.propertyId || null,
        unitId: body.unit || body.unitId || null,
      }
    });

    await createNotification({
      userId: req.user.id,
      title: 'New Expense Added',
      description: `New expense of ${expense.amount} recorded for "${expense.title}".`,
      type: 'payment',
      link: '/expenses',
      metadata: { expenseId: expense.id }
    });

    res.status(201).json(fmt(expense));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { createdById: req.user.id },
      include: {
        property: { select: { id: true, title: true } },
        unit: { select: { id: true, unitNumber: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(expenses.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalStats, thisMonthStats, byCategory] = await Promise.all([
      prisma.expense.aggregate({
        where: { createdById: req.user.id },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.expense.aggregate({
        where: {
          createdById: req.user.id,
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { createdById: req.user.id },
        _sum: { amount: true }
      })
    ]);

    res.json({
      totalExpense: totalStats._sum.amount || 0,
      totalRecords: totalStats._count.id || 0,
      thisMonthExpense: thisMonthStats._sum.amount || 0,
      categories: byCategory.map(c => ({ _id: c.category, amount: c._sum.amount }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await prisma.trash.create({
      data: { collectionName: 'Expense', document: expense }
    });
    await prisma.expense.delete({ where: { id: req.params.id } });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
