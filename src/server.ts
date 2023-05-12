import express from 'express';
import cors from 'cors';
import userRouter from './routes/users';
import checklistRouter from './routes/checklists';
import taskRouter from './routes/tasks';
import { IUser } from './models/User';
import './database/index';
const app = express();

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.use('/checklists', checklistRouter, taskRouter);

app.listen(8000, () => {
    console.log('Servidor Rodando!');
});