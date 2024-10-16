import express from 'express';


import * as groupController from '../controllers/groupController.js';

const groupRouter = express.Router();

// Group CRUD routes
groupRouter.post('/', groupController.createGroup);
groupRouter.get('/', groupController.getGroup);
groupRouter.patch('/:groupId', groupController.updateGroup);
groupRouter.delete('/:groupId', groupController.deleteGroup);
groupRouter.get('/:groupId', groupController.getGroupDetail);
groupRouter.post('/:groupId/verify-password', groupController.verifyGroupPassword);
groupRouter.post('/:groupId/like', groupController.likeGroup);
groupRouter.get('/:groupId/members', groupController.isGroupPublic);
groupRouter.post('/:groupId/posts', groupController.createGroupPost);
groupRouter.get('/:groupId/posts', groupController.getGroupPost);

export default groupRouter;