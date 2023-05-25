import express from 'express';
import cors from 'cors';

import { IUser } from './interfaces/IUser';
import { taskRouter, taskWithChecklistRouter } from './routes/tasks';
import userRouter from './routes/users';
import checklistRouter from './routes/checklists';
import './database/index';
const app = express();

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.use('/checklists', checklistRouter, taskWithChecklistRouter);
app.use('/tasks', taskRouter);

app.listen(8000, () => {
    console.log('Servidor Rodando!');
});