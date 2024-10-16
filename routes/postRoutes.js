import express from 'express';

import * as postController from '../controllers/postController.js';

const postRouter = express.Router();

// Post CRUD routes
postRouter.put('/:postId', postController.updatePost);
postRouter.delete('/:postId', postController.deletePost);
postRouter.get('/:postId', postController.getPostDetail);
postRouter.post('/:postId/verify-password', postController.verifyPostPassword);
postRouter.post('/:postId/like', postController.likePost);
postRouter.get('/:postId/is-public', postController.isPostPublic);

export default postRouter;