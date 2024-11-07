import { Router } from 'express';
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    assignTask
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Base tasks routes
router.route('/tasks')
    .get(authMiddleware, getAllTasks)
    .post(authMiddleware, createTask);

// Individual task routes
router.route('/tasks/:id')
    .patch(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

// Assign task to user
router.route('/tasks/:taskId/assign/:userId')
    .patch(authMiddleware, assignTask);

export default router;
