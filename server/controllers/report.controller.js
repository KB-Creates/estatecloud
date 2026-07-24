import prisma from '../lib/prisma.js';

export const getFinancialReport = async (req, res) => {
  try {
    const { year, from, to } = req.query;
    const hasCustomRange = Boolean(from || to);
    const targetYear = parseInt(year) || new Date().getFullYear();

    const startDate = hasCustomRange && from ? new Date(from) : new Date(targetYear, 0, 1);
    const endDate = hasCustomRange && to ? new Date(to) : new Date(targetYear, 11, 31, 23, 59, 59);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Get payments grouped by month
    const payments = await prisma.payment.findMany({
      where: {
        createdById: req.user.id,
        createdAt: { gte: startDate, lte: endDate }
      },
      select: { receivedAmount: true, createdAt: true }
    });

    // Get expenses grouped by month
    const expenses = await prisma.expense.findMany({
      where: {
        createdById: req.user.id,
        date: { gte: startDate, lte: endDate }
      },
      select: { amount: true, date: true, category: true }
    });

    const bucketMonths = [];
    const cursor = new Date(startDate);
    cursor.setDate(1);
    while (cursor <= endDate) {
      bucketMonths.push({
        month: cursor.toLocaleString('default', { month: 'short' }),
        year: cursor.getFullYear(),
        monthNum: cursor.getMonth(),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const reportData = bucketMonths.map(({ month, year: bucketYear, monthNum }) => {
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === monthNum && paymentDate.getFullYear() === bucketYear;
      });
      const monthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === monthNum && expenseDate.getFullYear() === bucketYear;
      });
      const income = monthPayments.reduce((sum, p) => sum + p.receivedAmount, 0);
      const expense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        name: month,
        income,
        expense,
        gains: income - expense,
        yield: income > 0 ? ((income - expense) / income * 100).toFixed(1) + '%' : '0%'
      };
    });

    const totalReceipts = reportData.reduce((sum, item) => sum + item.income, 0);
    const operatingOutflow = reportData.reduce((sum, item) => sum + item.expense, 0);
    const netProfit = totalReceipts - operatingOutflow;
    const profitMargin = totalReceipts > 0 ? (netProfit / totalReceipts * 100).toFixed(1) : '0.0';
    const reserved = netProfit * 0.2;

    const breakdown = {
      salaries: expenses.filter(e => e.category?.toLowerCase().includes('salary')).reduce((sum, e) => sum + e.amount, 0),
      operating: expenses.filter(e => !e.category?.toLowerCase().includes('salary') && !e.category?.toLowerCase().includes('commission')).reduce((sum, e) => sum + e.amount, 0),
      commissions: expenses.filter(e => e.category?.toLowerCase().includes('commission')).reduce((sum, e) => sum + e.amount, 0),
    };

    res.json({
      summary: { totalReceipts, operatingOutflow, netProfit, profitMargin, reserved },
      chartData: reportData.map(item => ({ name: item.name, income: item.income, expense: item.expense })),
      ledgerData: reportData.map(item => ({
        period: hasCustomRange ? item.name : `${item.name} ${targetYear}`,
        revenue: item.income,
        expenditure: item.expense,
        gains: item.gains,
        yield: item.yield
      })),
      breakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role?.toLowerCase() || 'user';
    const userName = req.user.name;
    const userEmail = req.user.email;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Fetch user settings or fallback to admin settings to find currency symbol
    let settings = await prisma.setting.findUnique({
      where: { userId }
    });
    if (!settings) {
      settings = await prisma.setting.findFirst({
        where: { user: { role: 'admin' } }
      });
    }
    const getCurrencySymbol = (currency) => {
      if (!currency) return '$';
      if (currency.includes('PKR')) return '₨. ';
      if (currency.includes('EUR')) return '€ ';
      if (currency.includes('AED')) return 'AED. ';
      if (currency.includes('SAR')) return 'SR. ';
      if (currency.includes('USD')) return '$';
      const parts = currency.split(' ');
      if (parts[0].length <= 3) return parts[0];
      return '$';
    };
    const currencySymbol = getCurrencySymbol(settings?.currency);

    // Shared chart building utility helper
    const buildChartData = (payments, expenses, salesPayments) => {
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
      return months.map(m => {
        const rev = payments
          .filter(p => new Date(p.createdAt).getMonth() === m.monthNum && new Date(p.createdAt).getFullYear() === m.year)
          .reduce((sum, p) => sum + p.receivedAmount, 0);
        const exp = expenses
          .filter(e => new Date(e.date).getMonth() === m.monthNum && new Date(e.date).getFullYear() === m.year)
          .reduce((sum, e) => sum + e.amount, 0);
        const sales = salesPayments.filter(s => new Date(s.createdAt).getMonth() === m.monthNum && new Date(s.createdAt).getFullYear() === m.year).length;
        return { name: m.month, revenue: rev, expense: exp, sales };
      });
    };

    // Shared activity builder
    const buildActivityFeed = ({
      payments = [],
      inquiries = [],
      maintenances = [],
      units = [],
      properties = [],
      bookings = [],
      expenses = [],
      contracts = [],
      payrolls = [],
      users = []
    }) => {
      return [
        ...payments.map(p => ({ id: p.id, _id: p.id, type: 'payment', title: 'New Payment Received', description: `Payment of ${currencySymbol}${p.receivedAmount} received from ${p.client}`, time: p.createdAt, icon: 'payment', user: p.createdBy?.name || 'System' })),
        ...inquiries.map(i => ({ id: i.id, _id: i.id, type: 'inquiry', title: 'New Inquiry', description: `New inquiry from ${i.name}`, time: i.createdAt, icon: 'inquiry', user: i.user?.name || 'System' })),
        ...maintenances.map(m => ({ id: m.id, _id: m.id, type: 'maintenance', title: 'Maintenance Request', description: m.title, time: m.createdAt, icon: 'maintenance', user: m.user?.name || 'System' })),
        ...units.map(u => ({ id: u.id, _id: u.id, type: 'unit', title: 'New Unit Created', description: `Unit ${u.unitNumber} added to ${u.property?.title || 'Property'}`, time: u.createdAt, icon: 'unit', user: u.user?.name || 'System' })),
        ...properties.map(pr => ({ id: pr.id, _id: pr.id, type: 'property', title: 'New Property Added', description: `${pr.title} has been listed`, time: pr.createdAt, icon: 'property', user: pr.user?.name || 'System' })),
        ...bookings.map(b => ({ id: b.id, _id: b.id, type: 'booking', title: 'New Booking', description: `New booking for ${b.property?.title || 'Property'}`, time: b.createdAt, icon: 'booking', user: b.user?.name || 'System' })),
        ...expenses.map(e => ({ id: e.id, _id: e.id, type: 'expense', title: 'New Expense Logged', description: `${e.category} expense of ${currencySymbol}${e.amount} recorded`, time: e.createdAt, icon: 'expense', user: e.createdBy?.name || 'System' })),
        ...contracts.map(c => ({ id: c.id, _id: c.id, type: 'contract', title: 'New Contract', description: `${c.contractType} for ${c.clientName}`, time: c.createdAt, icon: 'contract', user: c.user?.name || 'System' })),
        ...payrolls.map(py => ({ id: py.id, _id: py.id, type: 'payroll', title: 'Payroll Processed', description: `Salary of ${currencySymbol}${py.totalAmount} for ${py.staff?.name}`, time: py.createdAt, icon: 'payroll', user: 'System' })),
        ...users.map(u => ({ id: u.id, _id: u.id, type: 'user', title: 'New User Registered', description: `${u.name} joined as ${u.role}`, time: u.createdAt, icon: 'user', user: 'System' })),
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 50);
    };

    if (userRole === 'admin' || req.user.permissions === 'all') {
      // ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
      const [
        totalRevenueAgg,
        totalExpensesAgg,
        totalBookings,
        activeProperties,
        openInquiries,
        totalSalesCount,
        recentPayments,
        recentInquiries,
        recentMaintenance,
      ] = await Promise.all([
        prisma.payment.aggregate({ _sum: { receivedAmount: true } }),
        prisma.expense.aggregate({ _sum: { amount: true } }),
        prisma.booking.count(),
        prisma.property.count(),
        prisma.inquiry.count({ where: { status: 'New' } }),
        prisma.payment.count(),
        prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
        prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
        prisma.maintenance.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
      ]);

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
        prisma.unit.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
        prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.expense.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
        prisma.contract.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.payroll.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { staff: { select: { name: true } } } }),
        prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
        prisma.payment.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { receivedAmount: true, createdAt: true } }),
        prisma.expense.findMany({ where: { date: { gte: sixMonthsAgo } }, select: { amount: true, date: true } }),
        prisma.payment.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
      ]);

      const chartData = buildChartData(monthlyPayments, monthlyExpenses, monthlySales);
      const recentBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { property: true, unit: true }
      });

      const activity = buildActivityFeed({
        payments: recentPayments,
        inquiries: recentInquiries,
        maintenances: recentMaintenance,
        units: recentUnits,
        properties: recentProperties,
        bookings: activityBookings,
        expenses: recentExpenses,
        contracts: recentContracts,
        payrolls: recentPayrolls,
        users: recentUsers
      });

      return res.json({
        role: 'admin',
        stats: {
          totalRevenue: totalRevenueAgg._sum.receivedAmount || 0,
          totalExpenses: totalExpensesAgg._sum.amount || 0,
          totalBookings,
          activeProperties,
          openInquiries,
          totalSalesCount
        },
        chartData,
        recentBookings: recentBookings.map(b => ({ ...b, _id: b.id })),
        activity
      });
    }

    if (userRole === 'agent') {
      // ─── AGENT DASHBOARD ───────────────────────────────────────────────────────
      // Find properties linked to agent
      const agentProperties = await prisma.property.findMany({
        where: { OR: [{ agent: userId }, { userId }] },
        select: { id: true }
      });
      const agentPropIds = agentProperties.map(p => p.id);

      const [
        totalRevenueAgg,
        totalExpensesAgg,
        totalBookings,
        activeProperties,
        openInquiries,
        recentPayments,
        recentInquiries,
        recentMaintenance,
      ] = await Promise.all([
        prisma.payment.aggregate({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }] },
          _sum: { receivedAmount: true }
        }),
        prisma.expense.aggregate({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }] },
          _sum: { amount: true }
        }),
        prisma.booking.count({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { userId }] }
        }),
        prisma.property.count({
          where: { OR: [{ agent: userId }, { userId }] }
        }),
        prisma.inquiry.count({
          where: {
            OR: [
              { userId },
              { assignedToId: userId }
            ],
            status: 'New'
          }
        }),
        prisma.payment.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }] },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { createdBy: { select: { name: true } } }
        }),
        prisma.inquiry.findMany({
          where: {
            OR: [
              { userId },
              { assignedToId: userId }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { user: { select: { name: true } } }
        }),
        prisma.maintenance.findMany({
          where: { propertyId: { in: agentPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { user: { select: { name: true } } }
        })
      ]);

      const [
        recentUnits,
        recentProperties,
        activityBookings,
        recentExpenses,
        recentContracts,
        monthlyPayments,
        monthlyExpenses,
        monthlySales,
      ] = await Promise.all([
        prisma.unit.findMany({
          where: { propertyId: { in: agentPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.property.findMany({
          where: { OR: [{ agent: userId }, { userId }] },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { user: { select: { name: true } } }
        }),
        prisma.booking.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { userId }] },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.expense.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }] },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { createdBy: { select: { name: true } } }
        }),
        prisma.contract.findMany({
          where: { propertyId: { in: agentPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.payment.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }], createdAt: { gte: sixMonthsAgo } },
          select: { receivedAmount: true, createdAt: true }
        }),
        prisma.expense.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }], date: { gte: sixMonthsAgo } },
          select: { amount: true, date: true }
        }),
        prisma.payment.findMany({
          where: { OR: [{ propertyId: { in: agentPropIds } }, { createdById: userId }], createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true }
        }),
      ]);

      const chartData = buildChartData(monthlyPayments, monthlyExpenses, monthlySales);
      const recentBookings = await prisma.booking.findMany({
        where: { OR: [{ propertyId: { in: agentPropIds } }, { userId }] },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { property: true, unit: true }
      });

      const activity = buildActivityFeed({
        payments: recentPayments,
        inquiries: recentInquiries,
        maintenances: recentMaintenance,
        units: recentUnits,
        properties: recentProperties,
        bookings: activityBookings,
        expenses: recentExpenses,
        contracts: recentContracts
      });

      // Calculate personal commission estimate
      const agentUser = await prisma.user.findUnique({ where: { id: userId } });
      const commissionVal = agentUser?.commissionValue || 0;
      const totalRevVal = totalRevenueAgg._sum.receivedAmount || 0;
      const commissionEstimate = agentUser?.commissionType?.toLowerCase() === 'percentage'
        ? (totalRevVal * commissionVal) / 100
        : commissionVal * totalBookings;

      return res.json({
        role: 'agent',
        stats: {
          totalRevenue: totalRevVal,
          totalExpenses: totalExpensesAgg._sum.amount || 0,
          totalBookings,
          activeProperties,
          openInquiries,
          commissionEstimate
        },
        chartData,
        recentBookings: recentBookings.map(b => ({ ...b, _id: b.id })),
        activity
      });
    }

    if (userRole === 'owner') {
      // ─── OWNER DASHBOARD ───────────────────────────────────────────────────────
      const ownerProperties = await prisma.property.findMany({
        where: { OR: [{ owner: userId }, { userId }] },
        select: { id: true }
      });
      const ownerPropIds = ownerProperties.map(p => p.id);

      const [
        totalRevenueAgg,
        totalExpensesAgg,
        totalBookings,
        activeProperties,
        totalUnitsCount,
        occupiedUnitsCount,
        recentPayments,
        recentMaintenance,
      ] = await Promise.all([
        prisma.payment.aggregate({
          where: { propertyId: { in: ownerPropIds } },
          _sum: { receivedAmount: true }
        }),
        prisma.expense.aggregate({
          where: { propertyId: { in: ownerPropIds } },
          _sum: { amount: true }
        }),
        prisma.booking.count({
          where: { propertyId: { in: ownerPropIds } }
        }),
        prisma.property.count({
          where: { OR: [{ owner: userId }, { userId }] }
        }),
        prisma.unit.count({
          where: { propertyId: { in: ownerPropIds } }
        }),
        prisma.unit.count({
          where: {
            propertyId: { in: ownerPropIds },
            status: { in: ['Rented', 'Occupied'] }
          }
        }),
        prisma.payment.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { createdBy: { select: { name: true } } }
        }),
        prisma.maintenance.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { user: { select: { name: true } } }
        })
      ]);

      const [
        recentUnits,
        recentProperties,
        activityBookings,
        recentExpenses,
        recentContracts,
        monthlyPayments,
        monthlyExpenses,
        monthlySales,
      ] = await Promise.all([
        prisma.unit.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.property.findMany({
          where: { OR: [{ owner: userId }, { userId }] },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { user: { select: { name: true } } }
        }),
        prisma.booking.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.expense.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { createdBy: { select: { name: true } } }
        }),
        prisma.contract.findMany({
          where: { propertyId: { in: ownerPropIds } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, user: { select: { name: true } } }
        }),
        prisma.payment.findMany({
          where: { propertyId: { in: ownerPropIds }, createdAt: { gte: sixMonthsAgo } },
          select: { receivedAmount: true, createdAt: true }
        }),
        prisma.expense.findMany({
          where: { propertyId: { in: ownerPropIds }, date: { gte: sixMonthsAgo } },
          select: { amount: true, date: true }
        }),
        prisma.payment.findMany({
          where: { propertyId: { in: ownerPropIds }, createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true }
        }),
      ]);

      const occupancyRate = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;
      const chartData = buildChartData(monthlyPayments, monthlyExpenses, monthlySales);
      const recentBookings = await prisma.booking.findMany({
        where: { propertyId: { in: ownerPropIds } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { property: true, unit: true }
      });

      const activity = buildActivityFeed({
        payments: recentPayments,
        maintenances: recentMaintenance,
        units: recentUnits,
        properties: recentProperties,
        bookings: activityBookings,
        expenses: recentExpenses,
        contracts: recentContracts
      });

      // Sum of pending payments (outstanding balance) on owner properties
      const outstandingDuesAgg = await prisma.payment.aggregate({
        where: { propertyId: { in: ownerPropIds }, status: { not: 'Paid' } },
        _sum: { balance: true }
      });

      return res.json({
        role: 'owner',
        stats: {
          totalRevenue: totalRevenueAgg._sum.receivedAmount || 0,
          totalExpenses: totalExpensesAgg._sum.amount || 0,
          totalBookings,
          activeProperties,
          occupancyRate,
          outstandingDues: outstandingDuesAgg._sum.balance || 0
        },
        chartData,
        recentBookings: recentBookings.map(b => ({ ...b, _id: b.id })),
        activity
      });
    }

    if (userRole === 'staff') {
      // ─── STAFF DASHBOARD ───────────────────────────────────────────────────────
      const [
        pendingMaintenance,
        activeContracts,
        activeProperties,
        totalBookings,
        recentMaintenance,
        recentPayments,
      ] = await Promise.all([
        prisma.maintenance.count({ where: { status: { in: ['Pending', 'In Progress'] } } }),
        prisma.contract.count({ where: { status: 'Active' } }),
        prisma.property.count(),
        prisma.booking.count(),
        prisma.maintenance.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true } } } }),
        prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
      ]);

      const [
        recentUnits,
        recentProperties,
        activityBookings,
        recentExpenses,
        recentContracts,
        monthlyPayments,
        monthlyExpenses,
        monthlySales,
      ] = await Promise.all([
        prisma.unit.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { name: true } } } }),
        prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.expense.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { createdBy: { select: { name: true } } } }),
        prisma.contract.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { property: { select: { title: true } }, user: { select: { name: true } } } }),
        prisma.payment.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { receivedAmount: true, createdAt: true } }),
        prisma.expense.findMany({ where: { date: { gte: sixMonthsAgo } }, select: { amount: true, date: true } }),
        prisma.payment.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
      ]);

      const chartData = buildChartData(monthlyPayments, monthlyExpenses, monthlySales);
      const recentBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { property: true, unit: true }
      });

      const activity = buildActivityFeed({
        payments: recentPayments,
        maintenances: recentMaintenance,
        units: recentUnits,
        properties: recentProperties,
        bookings: activityBookings,
        expenses: recentExpenses,
        contracts: recentContracts
      });

      return res.json({
        role: 'staff',
        stats: {
          pendingMaintenance,
          activeContracts,
          activeProperties,
          totalBookings
        },
        chartData,
        recentBookings: recentBookings.map(b => ({ ...b, _id: b.id })),
        activity
      });
    }

    if (userRole === 'customer') {
      // ─── CUSTOMER DASHBOARD (TENANT) ───────────────────────────────────────────
      // Match by customer's client name in payments/contracts or their user id
      const [
        activeContracts,
        paidRentAgg,
        outstandingRentAgg,
        openMaintenanceRequests,
        recentPayments,
        recentMaintenance,
      ] = await Promise.all([
        prisma.contract.count({
          where: {
            OR: [
              { clientName: userName },
              { userId }
            ],
            status: 'Active'
          }
        }),
        prisma.payment.aggregate({
          where: {
            client: userName,
            status: 'Paid'
          },
          _sum: { receivedAmount: true }
        }),
        prisma.payment.aggregate({
          where: {
            client: userName,
            status: { not: 'Paid' }
          },
          _sum: { balance: true }
        }),
        prisma.maintenance.count({
          where: {
            OR: [
              { userId },
              { requestedBy: userName },
              { email: userEmail }
            ],
            status: { in: ['Pending', 'In Progress'] }
          }
        }),
        prisma.payment.findMany({
          where: { client: userName },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { createdBy: { select: { name: true } } }
        }),
        prisma.maintenance.findMany({
          where: {
            OR: [
              { userId },
              { requestedBy: userName },
              { email: userEmail }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { user: { select: { name: true } } }
        })
      ]);

      const [
        myContracts,
        myBookings,
        monthlyPayments,
      ] = await Promise.all([
        prisma.contract.findMany({
          where: {
            OR: [
              { clientName: userName },
              { userId }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, unit: { select: { unitNumber: true } } }
        }),
        prisma.booking.findMany({
          where: {
            OR: [
              { customerName: userName },
              { email: userEmail },
              { userId }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { property: { select: { title: true } }, unit: { select: { unitNumber: true } } }
        }),
        prisma.payment.findMany({
          where: { client: userName, createdAt: { gte: sixMonthsAgo } },
          select: { receivedAmount: true, createdAt: true }
        })
      ]);

      const chartData = buildChartData(monthlyPayments, [], []);

      const activity = [
        ...recentPayments.map(p => ({ id: p.id, _id: p.id, type: 'payment', title: 'Rent Paid', description: `Rent payment of ${currencySymbol}${p.receivedAmount} recorded.`, time: p.createdAt, icon: 'payment', user: 'System' })),
        ...recentMaintenance.map(m => ({ id: m.id, _id: m.id, type: 'maintenance', title: 'Maintenance Update', description: `Request "${m.title}" is ${m.status}.`, time: m.createdAt, icon: 'maintenance', user: 'System' })),
        ...myContracts.map(c => ({ id: c.id, _id: c.id, type: 'contract', title: 'Lease Created', description: `Lease contract ${c.contractNumber} is ${c.status}.`, time: c.createdAt, icon: 'contract', user: 'System' })),
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 30);

      return res.json({
        role: 'customer',
        stats: {
          activeContracts,
          paidRent: paidRentAgg._sum.receivedAmount || 0,
          outstandingRent: outstandingRentAgg._sum.balance || 0,
          openMaintenanceRequests
        },
        chartData,
        myContracts: myContracts.map(c => ({ ...c, _id: c.id })),
        myBookings: myBookings.map(b => ({ ...b, _id: b.id })),
        recentBookings: myBookings.map(b => ({ ...b, _id: b.id })),
        activity
      });
    }

    // Default fallback
    return res.json({
      role: 'generic',
      stats: {
        totalRevenue: 0,
        totalExpenses: 0,
        totalBookings: 0,
        activeProperties: 0,
        openInquiries: 0,
        totalSalesCount: 0
      },
      chartData: [],
      recentBookings: [],
      activity: []
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: error.message });
  }
};
