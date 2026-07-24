import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

const computePaymentStatus = (baseAmount, receivedAmount) => {
  if (receivedAmount >= baseAmount) return 'Paid';
  if (receivedAmount > 0) return 'Partial';
  return 'Unpaid';
};

const genVerificationCode = () => 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();

export const createPayment = async (req, res) => {
  try {
    const body = { ...req.body };
    const baseAmount = Number(body.baseAmount);
    const receivedAmount = Number(body.receivedAmount);
    const balance = baseAmount - receivedAmount;
    const status = computePaymentStatus(baseAmount, receivedAmount);

    const payment = await prisma.payment.create({
      data: {
        client: body.client,
        paymentType: body.paymentType || 'Monthly Rent',
        paymentMethod: body.paymentMethod || 'Cash',
        billingMonth: body.billingMonth,
        billingYear: Number(body.billingYear),
        baseAmount,
        receivedAmount,
        balance,
        status,
        internalNotes: body.internalNotes || null,
        verificationCode: genVerificationCode(),
        propertyId: body.property || body.propertyId,
        unitId: body.unit || body.unitId || null,
        contractId: body.contract || body.contractId || null,
        createdById: req.user.id,
      }
    });

    await createNotification({
      userId: req.user.id,
      title: status === 'Partial' ? 'Partial Payment Received' : 'Payment Received',
      description: status === 'Partial'
        ? `Partial payment of ${payment.receivedAmount} received from ${payment.client} (Remaining: ${payment.balance})`
        : `Full payment of ${payment.receivedAmount} received from ${payment.client}`,
      type: 'payment',
      link: '/payments',
      metadata: { paymentId: payment.id }
    });

    res.status(201).json(fmt(payment));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { createdById: req.user.id },
      include: {
        property: { select: { id: true, title: true } },
        unit: { select: { id: true, unitNumber: true, block: true } },
        contract: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { property: true, unit: true, contract: true }
    });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(fmt(payment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const existing = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Payment not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.verificationCode;

    const baseAmount = body.baseAmount !== undefined ? Number(body.baseAmount) : existing.baseAmount;
    const receivedAmount = body.receivedAmount !== undefined ? Number(body.receivedAmount) : existing.receivedAmount;
    const balance = baseAmount - receivedAmount;
    const status = computePaymentStatus(baseAmount, receivedAmount);

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { ...body, baseAmount, receivedAmount, balance, status }
    });

    await createNotification({
      userId: req.user.id,
      title: 'Payment Edited',
      description: `Payment record for ${payment.client} was successfully updated.`,
      type: 'payment',
      link: '/payments',
      metadata: { paymentId: payment.id }
    });

    res.json(fmt(payment));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await prisma.payment.delete({ where: { id: req.params.id } });

    await createNotification({
      userId: req.user.id,
      title: 'Payment Deleted',
      description: `Payment record of ${payment.receivedAmount} for ${payment.client} was successfully deleted.`,
      type: 'payment',
      link: '/payments'
    });

    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalStats, thisMonthStats] = await Promise.all([
      prisma.payment.aggregate({
        where: { createdById: req.user.id },
        _sum: { receivedAmount: true, balance: true },
        _count: { id: true }
      }),
      prisma.payment.aggregate({
        where: {
          createdById: req.user.id,
          createdAt: { gte: startOfMonth }
        },
        _sum: { receivedAmount: true }
      })
    ]);

    res.json({
      totalCollected: totalStats._sum.receivedAmount || 0,
      totalDues: totalStats._sum.balance || 0,
      totalRecords: totalStats._count.id || 0,
      thisMonthCollected: thisMonthStats._sum.receivedAmount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
