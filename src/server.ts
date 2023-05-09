import express from 'express';
import userRouter from './routes/users';
import checklistRouter from './routes/checklists';
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.use('/checklists/', checklistRouter);

app.listen(8000, () => {
    console.log('Servidor Rodando!');
});