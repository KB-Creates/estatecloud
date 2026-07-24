import express from 'express';
import * as agentController from '../controllers/agent.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('agents', 'create'), agentController.createAgent);
router.get('/', checkPermission('agents', 'view'), agentController.getAgents);
router.put('/:id', checkPermission('agents', 'edit'), agentController.updateAgent);
router.patch('/:id', checkPermission('agents', 'edit'), agentController.updateAgent);
router.delete('/:id', checkPermission('agents', 'delete'), agentController.deleteAgent);

export default router;
