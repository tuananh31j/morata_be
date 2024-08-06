import { ROLE } from '@/constant/allowedRoles';
import { userController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
// import filterBody from '@/middlewares/filterBody';
import upload from '@/middlewares/multerMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/private', authenticate, userController.getUserProfile);
router.patch('/private', authenticate, upload.single('avatar'), userController.updateUserProfile);

router.get('/all', authenticate, authorize(ROLE.ADMIN), userController.getAllUsers);
router.get('/:userId', authenticate, authorize(ROLE.ADMIN), userController.getUserDetails);
router.post('/', authenticate, upload.single('avatar'), authorize(ROLE.ADMIN), userController.createUser);
router.patch('/:userId', authenticate, upload.single('avatar'), authorize(ROLE.ADMIN), userController.updateUser);

export default router;
