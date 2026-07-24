import prisma from '../lib/prisma.js';
import { sendEmail } from '../utils/email.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.setting.findUnique({ where: { userId: req.user.id } });

    if (!settings) {
      settings = await prisma.setting.create({
        data: { userId: req.user.id }
      });
    }

    res.json(fmt(settings));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;

    const settings = await prisma.setting.upsert({
      where: { userId: req.user.id },
      update: body,
      create: { userId: req.user.id, ...body }
    });

    res.json(fmt(settings));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadBackup = async (req, res) => {
  try {
    const userId = req.user.id;

    const [settings, properties, units, payments, expenses, contracts, bookings, inquiries, maintenances, payrolls, roles, users] = await Promise.all([
      prisma.setting.findMany({ where: { userId } }),
      prisma.property.findMany({ where: { userId } }),
      prisma.unit.findMany({ where: { userId } }),
      prisma.payment.findMany({ where: { createdById: userId } }),
      prisma.expense.findMany({ where: { createdById: userId } }),
      prisma.contract.findMany({ where: { userId } }),
      prisma.booking.findMany({ where: { userId } }),
      prisma.inquiry.findMany({ where: { userId } }),
      prisma.maintenance.findMany({ where: { userId } }),
      prisma.payroll.findMany({ where: { createdById: userId } }),
      prisma.role.findMany(),
      prisma.user.findMany({
        where: { OR: [{ id: userId }, { createdById: userId }] },
        omit: { password: true }
      }),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      user: { name: req.user.name, email: req.user.email },
      data: { settings, properties, units, payments, expenses, contracts, bookings, inquiries, maintenance: maintenances, payroll: payrolls, roles, users }
    };

    const fileName = `property_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const testEmail = async (req, res) => {
  try {
    await sendEmail({
      to: req.body.testEmail || req.user.email,
      subject: 'SMTP Test Email',
      text: 'This is a test email to verify your SMTP configuration.',
      html: '<h3>SMTP Test Email</h3><p>This is a test email to verify your SMTP configuration.</p>',
      userId: req.user.id
    });

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    const userId = req.user.id;
    const backup = req.body;

    if (!backup || !backup.data) {
      return res.status(400).json({ message: 'Invalid backup file format' });
    }

    const data = backup.data;

    // Clear existing data for this user
    await Promise.all([
      prisma.setting.deleteMany({ where: { userId } }),
      prisma.property.deleteMany({ where: { userId } }),
      prisma.unit.deleteMany({ where: { userId } }),
      prisma.payment.deleteMany({ where: { createdById: userId } }),
      prisma.expense.deleteMany({ where: { createdById: userId } }),
      prisma.contract.deleteMany({ where: { userId } }),
      prisma.booking.deleteMany({ where: { userId } }),
      prisma.inquiry.deleteMany({ where: { userId } }),
      prisma.maintenance.deleteMany({ where: { userId } }),
      prisma.payroll.deleteMany({ where: { createdById: userId } }),
      prisma.user.deleteMany({ where: { createdById: userId } }),
    ]);

    // Insert new data
    if (data.settings?.length) await prisma.setting.createMany({ data: data.settings.map(s => ({ ...s, id: undefined })) });
    if (data.properties?.length) await prisma.property.createMany({ data: data.properties.map(p => ({ ...p, id: undefined })) });
    if (data.units?.length) await prisma.unit.createMany({ data: data.units.map(u => ({ ...u, id: undefined })) });
    if (data.contracts?.length) await prisma.contract.createMany({ data: data.contracts.map(c => ({ ...c, id: undefined })) });
    if (data.bookings?.length) await prisma.booking.createMany({ data: data.bookings.map(b => ({ ...b, id: undefined })) });
    if (data.inquiries?.length) await prisma.inquiry.createMany({ data: data.inquiries.map(i => ({ ...i, id: undefined })) });
    if (data.maintenance?.length) await prisma.maintenance.createMany({ data: data.maintenance.map(m => ({ ...m, id: undefined })) });
    if (data.payments?.length) await prisma.payment.createMany({ data: data.payments.map(p => ({ ...p, id: undefined })) });
    if (data.expenses?.length) await prisma.expense.createMany({ data: data.expenses.map(e => ({ ...e, id: undefined })) });
    if (data.payroll?.length) await prisma.payroll.createMany({ data: data.payroll.map(p => ({ ...p, id: undefined })) });

    res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    console.error('Restore Error:', error);
    res.status(500).json({ message: error.message });
  }
};
