import express from 'express';
import TaskController from '../controllers/TaskController';
import { WithAuth } from '../middlewares/auth';
export const taskWithChecklistRouter = express.Router();

taskWithChecklistRouter.get('/:checklistId/tasks/', WithAuth, TaskController.searchChecklistTasks);
taskWithChecklistRouter.post('/:checklistId/tasks', WithAuth, TaskController.create);
taskWithChecklistRouter.put('/:checklistId/tasks/:taskId', WithAuth, TaskController.update);
taskWithChecklistRouter.patch('/:checklistId/tasks/:taskId', WithAuth, TaskController.setTaskAsDone);
taskWithChecklistRouter.delete('/:checklistId/tasks/:taskId', WithAuth, TaskController.delete);

export const taskRouter = express.Router();

taskRouter.get('/tasksWithShortDeadlineOrLate', WithAuth, TaskController.searchTasksWithShortDeadlineOrLate);