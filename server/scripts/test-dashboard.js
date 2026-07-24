import prisma from '../lib/prisma.js';

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: { equals: 'admin', mode: 'insensitive' } }
  });
  if (!admin) {
    console.error("No admin user found!");
    process.exit(1);
  }
  
  console.log(`Testing dashboard stats for user: ${admin.name} (ID: ${admin.id})`);
  
  const userId = admin.id;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  try {
    console.log("Executing Group 1 queries...");
    const [
      totalRevenueAgg,
      totalExpensesAgg,
      totalBookings,
      activeProperties,
      openInquiries,
      totalSalesCount,
      settings,
      recentPayments,
      recentInquiries,
      recentMaintenance,
    ] = await Promise.all([
      prisma.payment.aggregate({ where: { createdById: userId }, _sum: { receivedAmount: true } }),
      prisma.expense.aggregate({ where: { createdById: userId }, _sum: { amount: true } }),
      prisma.booking.count({ where: { userId } }),
      prisma.property.count({ where: { userId } }),
      prisma.inquiry.count({ where: { userId, status: 'New' } }),
      prisma.payment.count({ where: { createdById: userId } }),
      prisma.setting.findUnique({ where: { userId } }),
      prisma.payment.findMany({ where: { createdById: userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
      prisma.inquiry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
      prisma.maintenance.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
    ]);

    console.log("Executing Group 2 queries...");
    const [
      recentUnits,
      recentProperties,
      activityBookings,
      recentExpenses,
      recentContracts,
      recentPayrolls,
      recentUsers,
      monthlyPayments,
      monthlyExpenses,
      monthlySales,
    ] = await Promise.all([
      prisma.unit.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
      prisma.property.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
      prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
      prisma.expense.findMany({ where: { createdById: userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
      prisma.contract.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
      prisma.payroll.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { staff: { select: { name: true } } } }),
      prisma.user.findMany({ where: { id: userId }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.payment.findMany({ where: { createdById: userId, createdAt: { gte: sixMonthsAgo } }, select: { receivedAmount: true, createdAt: true } }),
      prisma.expense.findMany({ where: { createdById: userId, date: { gte: sixMonthsAgo } }, select: { amount: true, date: true } }),
      prisma.payment.findMany({ where: { createdById: userId, createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
    ]);

    const currencySymbol = settings?.currency?.split(' ')[0] || '$';

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth()
      });
    }

    const chartData = months.map(m => {
      const rev = monthlyPayments
        .filter(p => new Date(p.createdAt).getMonth() === m.monthNum && new Date(p.createdAt).getFullYear() === m.year)
        .reduce((sum, p) => sum + p.receivedAmount, 0);
      const exp = monthlyExpenses
        .filter(e => new Date(e.date).getMonth() === m.monthNum && new Date(e.date).getFullYear() === m.year)
        .reduce((sum, e) => sum + e.amount, 0);
      const sales = monthlySales.filter(s => new Date(s.createdAt).getMonth() === m.monthNum && new Date(s.createdAt).getFullYear() === m.year).length;
      return { name: m.month, revenue: rev, expense: exp, sales };
    });

    const recentBookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { property: true, unit: true }
    });

    const activity = [
      ...recentPayments.map(p => ({ id: p.id, _id: p.id, type: 'payment', title: 'New Payment Received', description: `Payment of ${currencySymbol}${p.receivedAmount} received from ${p.client}`, time: p.createdAt, icon: 'payment', user: p.createdBy?.name || 'System' })),
      ...recentInquiries.map(i => ({ id: i.id, _id: i.id, type: 'inquiry', title: 'New Inquiry', description: `New inquiry from ${i.name}`, time: i.createdAt, icon: 'inquiry', user: i.user?.name || 'System' })),
      ...recentMaintenance.map(m => ({ id: m.id, _id: m.id, type: 'maintenance', title: 'Maintenance Request', description: m.title, time: m.createdAt, icon: 'maintenance', user: m.user?.name || 'System' })),
      ...recentUnits.map(u => ({ id: u.id, _id: u.id, type: 'unit', title: 'New Unit Created', description: `Unit ${u.unitNumber} added to ${u.property?.title || 'Property'}`, time: u.createdAt, icon: 'unit', user: u.user?.name || 'System' })),
      ...recentProperties.map(pr => ({ id: pr.id, _id: pr.id, type: 'property', title: 'New Property Added', description: `${pr.title} has been listed`, time: pr.createdAt, icon: 'property', user: pr.user?.name || 'System' })),
      ...activityBookings.map(b => ({ id: b.id, _id: b.id, type: 'booking', title: 'New Booking', description: `New booking for ${b.property?.title || 'Property'}`, time: b.createdAt, icon: 'booking', user: b.user?.name || 'System' })),
      ...recentExpenses.map(e => ({ id: e.id, _id: e.id, type: 'expense', title: 'New Expense Logged', description: `${e.category} expense of ${currencySymbol}${e.amount} recorded`, time: e.createdAt, icon: 'expense', user: e.createdBy?.name || 'System' })),
      ...recentContracts.map(c => ({ id: c.id, _id: c.id, type: 'contract', title: 'New Contract', description: `${c.contractType} for ${c.clientName}`, time: c.createdAt, icon: 'contract', user: c.user?.name || 'System' })),
      ...recentPayrolls.map(py => ({ id: py.id, _id: py.id, type: 'payroll', title: 'Payroll Processed', description: `Salary of $${py.totalAmount} for ${py.staff?.name}`, time: py.createdAt, icon: 'payroll', user: 'System' })),
      ...recentUsers.map(u => ({ id: u.id, _id: u.id, type: 'user', title: 'New User Registered', description: `${u.name} joined as ${u.role}`, time: u.createdAt, icon: 'user', user: 'System' })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 50);

    console.log("Success! Full Dashboard mapping run successfully!");
    console.log("Activity Count:", activity.length);
  } catch (error) {
    console.error("Dashboard full check failed:", error);
  }

  process.exit(0);
}

main();
