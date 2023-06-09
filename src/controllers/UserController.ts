import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User";
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_TOKEN!;

class UserController {
    public async register(req: Request, res: Response) {
        const { username, email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });

            if (user)
                return res.status(400).json({ error: 'E-mail already exists' });

            await User.create({ username, email, password });
            res.status(200).json({ message: 'User successfully created' });

        } catch (error) {
            res.status(500).json({ error: 'Problem to creater user' });
            console.log(error);
        }
    }

    public async delete(req: Request, res: Response) {
        const { user_id } = req.user!;

        try {
            await User.destroy({ where: { user_id } });
            res.status(200).json({ message: 'User successfully deleted' });

        } catch (error) {
            res.status(500).json({ error: 'Problem to delete user' });
            console.log(error);
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ where: { email } });

            if (!user)
                return res.status(401).json({ error: 'incorrect email or password' });

            if (await user.isCorrectPassword(password)) {

                const token = jwt.sign({ email }, secretKey, { expiresIn: '1d' });
                res.status(200).json({ user, token });
            } else {
                res.status(401).json({ error: 'incorrect email or password' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Problem to make your login' });
            console.log(error);
        }
    }

    public async update(req: Request, res: Response) {
        const { username, email, password } = req.body;
        let userId = req.user?.user_id;

        try {

            await User.update({ username, email, password }, { where: { user_id: userId }, individualHooks: true });


            let user = await User.findByPk(userId);
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ error: 'Problem to update your user' });
            console.log(error);
        }

    }
}


export default new UserController();