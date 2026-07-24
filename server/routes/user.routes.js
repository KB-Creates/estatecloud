import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, checkPermission } from './auth.middleware.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.use(protect);

const checkUserOrCustomerPermission = (action) => {
  return async (req, res, next) => {
    let featureId = 'users';

    if (req.query.role === 'Customer' || (req.body && req.body.role === 'Customer')) {
      featureId = 'customers';
    } else if (req.params.id) {
      try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (user && user.role?.toLowerCase() === 'customer') {
          featureId = 'customers';
        }
      } catch (err) {
        console.error('Error fetching user role for permission check:', err);
      }
    }

    return checkPermission(featureId, action)(req, res, next);
  };
};

router.get('/', checkUserOrCustomerPermission('view'), userController.getAllUsers);
router.post('/', checkUserOrCustomerPermission('create'), userController.createUser);
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.patch('/:id', checkUserOrCustomerPermission('edit'), userController.updateUser);
router.delete('/:id', checkUserOrCustomerPermission('delete'), userController.deleteUser);
router.patch('/:id/role', checkUserOrCustomerPermission('edit'), userController.updateUserRole);

export default router;
