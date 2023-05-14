import express from 'express';
import TaskController from '../controllers/TaskController';
import { WithAuth } from '../middlewares/auth';
const router = express.Router();

router.get('/:checklistId/tasks/', WithAuth, TaskController.searchChecklistTasks);
router.post('/:checklistId/tasks', WithAuth, TaskController.create);
router.put('/:checklistId/tasks/:taskId', WithAuth, TaskController.update);
router.patch('/:checklistId/tasks/:taskId', WithAuth, TaskController.setTaskAsDone);
router.delete('/:checklistId/tasks/:taskId', WithAuth, TaskController.delete);

export default router;