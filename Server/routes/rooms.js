import express from 'express';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getRooms)
  .post(authorize('superadmin', 'admin', 'owner'), createRoom);

router.route('/:id')
  .put(authorize('superadmin', 'admin', 'owner'), updateRoom)
  .delete(authorize('superadmin', 'admin', 'owner'), deleteRoom);

export default router;