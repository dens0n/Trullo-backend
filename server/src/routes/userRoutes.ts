import { Router } from 'express';
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    logOutUser,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.route('/users').get(authMiddleware, getUsers);

router
    .route('/users/:id')
    .patch(authMiddleware, updateUser)
    .delete(authMiddleware, deleteUser);

router.post('/login', loginUser);
router.post('/signup', createUser);
router.post('/logout', authMiddleware, logOutUser);

export default router;
