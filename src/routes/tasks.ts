import express from 'express';
import TaskController from '../controllers/TaskController';
import { WithAuth } from '../middlewares/auth';
const router = express.Router();

router.get('/:checklistId/tasks', WithAuth, TaskController.showChecklistTasks);
router.get('/:checklistId/tasks/search/', WithAuth, TaskController.searchChecklistTasks);
router.post('/checklists/:checklistId/tasks', WithAuth, TaskController.create);
router.put('/:checklistId/tasks/:taskId', WithAuth, TaskController.update);
router.delete('/:checklistId/tasks/:taskId', WithAuth, TaskController.delete);
export default router;