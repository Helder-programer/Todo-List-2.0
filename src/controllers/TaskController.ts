import { Request, Response } from "express";
import Task from "../models/Task";
import { isChecklistOwner } from "../assets/checklist";
import { verifyTaskChecklistOwner } from '../assets/task';
import Checklist from "../models/Checklist";
import moment from "moment";

interface IReqBody {
    description: string;
    limitDate: string;
    priority: number;
}

class TaskController {
    public async create(req: Request<{ checklistId: number }, {}, IReqBody>, res: Response) {
        const { description, limitDate, priority } = req.body;
        const { checklistId } = req.params;

        try {
            let checklistToValidate = await Checklist.findByPk(checklistId);

            if (!checklistToValidate) return res.status(404).json({ error: 'Checklist not found' });

            if (isChecklistOwner(checklistToValidate, req.user!)) {
                let taskDate = limitDate;
                if (limitDate) {
                    taskDate = moment(taskDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
                }
                await Task.create({ description, limit_date: taskDate, priority, checklist_id: checklistId });
                return res.status(200).json({ message: 'Task created successfully' });
            }

            return res.status(401).json({ message: 'Permission denied' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to create task' });
        }
    }

    public async update(req: Request<{ checklistId: number, taskId: number }, {}, IReqBody>, res: Response) {
        const { checklistId, taskId } = req.params;
        const { description, limitDate, priority } = req.body;


        try {
            let checklistToValidate = await Checklist.findByPk(checklistId);
            let taskToValidate = await Task.findByPk(taskId);
            if (!checklistToValidate) return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate) return res.status(404).json({ message: 'Task not found' });

            if (isChecklistOwner(checklistToValidate, req.user!) && verifyTaskChecklistOwner(checklistToValidate, taskToValidate)) {
                let taskDate = limitDate;
                if (limitDate) {
                    taskDate = moment(taskDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
                }

                await Task.update({ description, limit_date: taskDate, priority }, { where: { task_id: taskId } });

                return res.status(200).json({ message: 'Task successfully updated' });
            }

            return res.status(401).json({ message: 'Permission denied' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }

    public async delete(req: Request<{ checklistId: number, taskId: number }>, res: Response) {
        const { checklistId, taskId } = req.params;

        try {
            let checklistToValidate = await Checklist.findByPk(checklistId);
            let taskToValidate = await Task.findByPk(taskId);
            if (!checklistToValidate) return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate) return res.status(404).json({ message: 'Task not found' });

            if (isChecklistOwner(checklistToValidate, req.user!) && verifyTaskChecklistOwner(checklistToValidate, taskToValidate)) {

                await Task.destroy({ where: { task_id: taskId } });

                return res.status(200).json({ message: 'Task successfully deleted' });
            }

            return res.status(401).json({ message: 'Permission denied' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }
}


export default new TaskController;