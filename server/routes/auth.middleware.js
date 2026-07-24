import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { company: true },
        omit: { password: true }
      });

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Check if user's tenant company is suspended (except superadmin)
      if (user.role !== 'superadmin' && user.company && user.company.status === 'Suspended') {
        return res.status(403).json({ message: 'Your account or company subscription is suspended. Please contact support.' });
      }

      req.user = {
        ...user,
        _id: user.id
      };
      req.companyId = user.role === 'superadmin' ? null : user.companyId;
      req.isSuperAdmin = user.role === 'superadmin';

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: `Not authorized, token failed: ${error.message}` });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const checkPermission = (featureId, action) => {
  return async (req, res, next) => {
    try {
      const userRoleName = req.user.role || 'user';

      // SuperAdmin & Admin bypass
      if (userRoleName.toLowerCase() === 'admin' || userRoleName.toLowerCase() === 'superadmin' || userRoleName.toLowerCase() === 'companyadmin') {
        req.viewScope = 'all';
        return next();
      }

      const role = await prisma.role.findFirst({
        where: {
          name: { equals: userRoleName, mode: 'insensitive' },
          ...(req.companyId ? { companyId: req.companyId } : {})
        }
      });

      if (!role) {
        return res.status(403).json({ message: 'Role permissions not found' });
      }

      const permissions = Array.isArray(role.permissions) ? role.permissions : [];
      const permission = permissions.find(p => p.featureId === featureId);

      if (!permission) {
        return res.status(403).json({ message: `Access denied for ${featureId}` });
      }

      if (action === 'view') {
        if (permission.viewScope === 'none') {
          return res.status(403).json({ message: 'View access denied' });
        }
        req.viewScope = permission.viewScope;
      } else {
        let resolvedAction = action;
        if (featureId === 'payments') {
          if (action === 'create') resolvedAction = 'receivePayment';
          else if (action === 'edit') resolvedAction = 'editPayment';
          else if (action === 'delete') resolvedAction = 'deletePayment';
        } else if (featureId === 'due_collection') {
          if (action === 'create' || action === 'edit' || action === 'delete') resolvedAction = 'manageRecovery';
        } else if (featureId === 'financial_reports') {
          if (action === 'view') resolvedAction = 'viewReports';
        } else if (featureId === 'bookings') {
          if (action === 'delete') resolvedAction = 'cancel';
        } else if (featureId === 'inquiries') {
          if (action === 'assign') resolvedAction = 'assignLead';
        }

        if (!permission.actions?.[resolvedAction]) {
          return res.status(403).json({ message: `${resolvedAction} access denied` });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
