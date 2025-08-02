import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('superadmin', 'admin'), getUsers)
  .post(authorize('superadmin', 'admin'), createUser);

router.route('/:id')
  .put(authorize('superadmin', 'admin'), updateUser)
  .delete(authorize('superadmin', 'admin'), deleteUser);

export default router;