import express from 'express';
import userRouter from './routes/users';
import './database/index';
import User, { IUser } from './models/User';
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


app.listen(8000, () => {
    console.log('Servidor Rodando!');
});