import express from 'express';
import ChecklistController from '../controllers/ChecklistController';
import { WithAuth } from '../middlewares/auth';
const router = express.Router();


router.get('/', WithAuth, ChecklistController.index);
router.get('/:checklistId', WithAuth, ChecklistController.showOneChecklist);
router.post('/', WithAuth, ChecklistController.create);
router.put('/:checklistId', WithAuth, ChecklistController.update);
router.delete('/:checklistId', WithAuth, ChecklistController.delete);

export default router;