import { Request, Response } from "express";
import Checklist, { IChecklist } from "../models/Checklist";


class ChecklistController {
    public async create(req: Request, res: Response) {
        const { name } = req.body;
        const userId = req.user?.user_id;

        try {

            await Checklist.create({ name, user_id: userId });
            res.status(200).json({ message: 'checklist successfully created' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to create new checklist' });
        }
    }

    public async update(req: Request, res: Response) {
        const { checklistId } = req.params;
        const { name } = req.body;

        try {


            const checklistToUpdate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id } });

            if (!checklistToUpdate) return res.status(404).json({ error: 'Checklist not found' });

            checklistToUpdate.setAttributes({ name });
            await checklistToUpdate.save();
            return res.status(200).json({ message: 'checklist successfully updated' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update checklist' });
        }
    }

    public async delete(req: Request, res: Response) {
        const { checklistId } = req.params;

        try {
            const checklistToDelete = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id } });

            if (!checklistToDelete) return res.status(404).json({ error: 'Checklist not found' });


            await checklistToDelete.destroy();
            return res.status(200).json({ message: 'checklist successfully deleted' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to delete checklist' });
        }
    }

    public async index(req: Request, res: Response) {

        try {
            const checklists = await Checklist.findAll({ where: { user_id: req.user!.user_id }, include: { association: 'tasks' } });
            res.status(200).json(checklists);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to show checklists' });
        }
    }

    public async showOneChecklist(req: Request, res: Response) {
        const { checklistId } = req.params;

        try {
            const searchedChecklist = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id }, include: { association: 'tasks' } });

            if (!searchedChecklist) return res.status(404).json({ error: 'Checklist not found' });

            return res.status(200).json(searchedChecklist);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to show checklist' });
        }
    }
}


export default new ChecklistController();