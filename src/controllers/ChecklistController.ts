import { Request, Response } from "express";
import Checklist, { IChecklist } from "../models/Checklist";
import User, { IUser } from "../models/User";


interface IReqParams {
    id: number;
}

interface IReqBody {
    name: string;
}


const isChecklistOwner = (checklist: IChecklist, user: IUser) => {
    let isOwner = checklist.user_id == user.user_id;
    return isOwner;
}


class ChecklistController {
    public async create(req: Request<{}, {}, IReqBody>, res: Response) {
        const { name } = req.body;
        const user_id = req.user?.user_id;

        try {

            await Checklist.create({ name, user_id });
            res.status(200).json({ message: 'checklist successfully created' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to create new checklist' });
        }
    }

    public async update(req: Request<IReqParams, {}, IReqBody>, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        const reqUser = req.user;

        try {

            let checklistToUpdate = await Checklist.findByPk(id);


            if (!checklistToUpdate) return res.status(404).json({ error: 'Checklist not found' });

            if (isChecklistOwner(checklistToUpdate, reqUser!)) {
                checklistToUpdate.setAttributes({ name });
                await checklistToUpdate.save();
                return res.status(200).json({ message: 'checklist successfully updated' });
            }

            return res.status(401).json({ error: 'Permission denied' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update checklist' });
        }
    }

    public async delete(req: Request<IReqParams>, res: Response) {
        const { id } = req.params;
        const reqUser = req.user;

        try {
            let checklistToDelete = await Checklist.findByPk(id);

            if (!checklistToDelete) return res.status(404).json({ error: 'Checklist not found' });

            if (isChecklistOwner(checklistToDelete, reqUser!)) {
                await checklistToDelete.destroy();
                return res.status(200).json({ message: 'checklist successfully deleted' });
            }

            return res.status(401).json({ error: 'Permission denied' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to delete checklist' });
        }
    }

    public async index(req: Request, res: Response) {

        try {
            let checklists = await Checklist.findAll({ where: { user_id: req.user!.user_id } });
            res.status(200).json(checklists);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to show checklists' });
        }
    }
}


export default new ChecklistController;