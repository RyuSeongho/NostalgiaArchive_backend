import express from 'express';

import * as commentController from '../controllers/commentController.js';

const commentRouter = express.Router();

// Post CRUD routes
commentRouter.put('/:commentId', commentController.updateComment);
commentRouter.delete('/:commentId', commentController.deleteComment);

export default commentRouter;