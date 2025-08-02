import express from 'express';
import { 
  getHostels, 
  createHostel, 
  updateHostel, 
  deleteHostel, 
  getHostelStats 
} from '../controllers/hostelController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('superadmin', 'admin'), getHostelStats);

router.route('/')
  .get(getHostels)
  .post(authorize('superadmin', 'admin', 'owner'), createHostel);

router.route('/:id')
  .put(authorize('superadmin', 'admin', 'owner'), updateHostel)
  .delete(authorize('superadmin', 'admin'), deleteHostel);

export default router;