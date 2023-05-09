import express from 'express';
import { WithAuth } from '../middlewares/auth';
import UserController from '../controllers/UserController';
const router = express.Router();

router.post('/', UserController.register);
router.post('/login', UserController.login);
router.put('/', WithAuth, UserController.update);
router.delete('/', WithAuth, UserController.delete);

export default router;