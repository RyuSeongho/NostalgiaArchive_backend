import express from 'express';

import * as groupController from '../controllers/groupController.js';

const router = express.Router();

// Group CRUD routes
router.post('/', groupController.createGroup);
router.get('/', groupController.getGroup);
router.patch('/:groupId', groupController.updateGroup);
router.delete('/:groupId', groupController.deleteGroup);
router.get('/:groupId', groupController.getGroupDetail);
router.post('/:groupId/verify-password', groupController.verifyGroupPassword);
router.post('/:groupId/like', groupController.likeGroup);
router.get('/:groupId/members', groupController.isGroupPublic);   

export default router;