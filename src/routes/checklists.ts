import express from 'express';
import ChecklistController from '../controllers/ChecklistController';
import { WithAuth } from '../middlewares/auth';
const router = express.Router();


router.get('/', WithAuth, ChecklistController.index);
router.get('/:id', WithAuth, ChecklistController.showChecklistTasks);
router.post('/', WithAuth, ChecklistController.create);
router.put('/:id', WithAuth, ChecklistController.update);
router.delete('/:id', WithAuth, ChecklistController.delete);

export default router;