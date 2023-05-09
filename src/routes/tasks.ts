import express from 'express';
import TaskController from '../controllers/TaskController';
import { WithAuth } from '../middlewares/auth';
const router = express.Router();

router.post('/checklists/:checklistId/tasks', WithAuth, TaskController.create);
router.put('/checklists/:checklistId/tasks/:taskId', WithAuth, TaskController.update);
router.delete('/checklists/:checklistId/tasks/:taskId', WithAuth, TaskController.delete);
export default router;