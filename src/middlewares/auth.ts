import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey: string = process.env.JWT_TOKEN!;


const WithAuth = <T>(req: Request<T>, res: Response, next: NextFunction) => {
    const token: any = req.headers['access-token'];

    if (!token)
        return res.status(401).json({ error: 'Unauthorized: no token provided' });

    jwt.verify(token, secretKey, (error: any, decoded: any) => {
        if (error) return res.status(401).json({ error: 'Unauthorized: invalid token' });

        User.findOne({ where: { email: decoded.email } }).then(user => {
            if (user) {
                req.user = user;
            }
            next();
        }).catch(err => {
            res.status(401).json({ error: 'Problem to authenticate' });
            console.log(err);
        });
    });
}


export { WithAuth };