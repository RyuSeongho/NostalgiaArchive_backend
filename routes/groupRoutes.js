import express from 'express';

import * as groupController from '../controllers/groupController.js';

const router = express.Router();

// Group CRUD routes
router.post('/', groupController.createGroup);
router.get('/', groupController.getGroup);

export default router;