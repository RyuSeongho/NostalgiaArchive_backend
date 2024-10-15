import express from 'express';

import {
    createGroup,
    getGroup
} from '../controllers/groupController.js';

const router = express.Router();

// Group CRUD routes
router.post('/', createGroup);
router.get('/', getGroup);

export default router;