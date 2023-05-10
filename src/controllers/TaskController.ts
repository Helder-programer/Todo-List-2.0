import { Request, Response } from "express";
import Task from "../models/Task";
import { isChecklistOwner } from "../assets/checklist";
import { verifyTaskChecklistOwner } from '../assets/task';
import Checklist from "../models/Checklist";
import moment from "moment";
import { Op, Sequelize, where } from "sequelize";

interface IReqBody {
    description: string;
    limitDate: string;
    priority: number;
}


interface IWhereConditionsToQuery {

}

class TaskController {
    public async create(req: Request<{ checklistId: number }, {}, IReqBody>, res: Response) {
        const { description, limitDate, priority } = req.body;
        const { checklistId } = req.params;

        try {
            const checklistToValidate = await Checklist.findByPk(checklistId);

            if (!checklistToValidate) return res.status(404).json({ error: 'Checklist not found' });

            if (!isChecklistOwner(checklistToValidate, req.user!)) return res.status(401).json({ message: 'Permission denied' });

            let taskDate = limitDate;
            if (limitDate) {
                taskDate = moment(taskDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }
            await Task.create({ description, limit_date: taskDate, priority, checklist_id: checklistId });


            return res.status(200).json({ message: 'Task created successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to create task' });
        }
    }

    public async update(req: Request<{ checklistId: number, taskId: number }, {}, IReqBody>, res: Response) {
        const { checklistId, taskId } = req.params;
        const { description, limitDate, priority } = req.body;


        try {
            const checklistToValidate = await Checklist.findByPk(checklistId);
            const taskToValidate = await Task.findByPk(taskId);
            if (!checklistToValidate) return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate) return res.status(404).json({ message: 'Task not found' });

            if (!(isChecklistOwner(checklistToValidate, req.user!)
                && verifyTaskChecklistOwner(checklistToValidate, taskToValidate))) return res.status(401).json({ message: 'Permission denied' });

            let taskDate = limitDate;
            if (limitDate) {
                taskDate = moment(taskDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            await Task.update({ description, limit_date: taskDate, priority }, { where: { task_id: taskId } });

            return res.status(200).json({ message: 'Task successfully updated' });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }

    public async delete(req: Request<{ checklistId: number, taskId: number }>, res: Response) {
        const { checklistId, taskId } = req.params;

        try {
            const checklistToValidate = await Checklist.findByPk(checklistId);
            const taskToValidate = await Task.findByPk(taskId);
            if (!checklistToValidate) return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate) return res.status(404).json({ message: 'Task not found' });

            if (!(isChecklistOwner(checklistToValidate, req.user!)
                && verifyTaskChecklistOwner(checklistToValidate, taskToValidate))) return res.status(401).json({ message: 'Permission denied' });

            await Task.destroy({ where: { task_id: taskId } });

            return res.status(200).json({ message: 'Task successfully deleted' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }


    public async showChecklistTasks(req: Request<{ checklistId: number }>, res: Response) {
        const { checklistId } = req.params;

        try {
            const searchedChecklist = await Checklist.findByPk(checklistId);

            if (!searchedChecklist) return res.status(404).json({ error: 'Checklist not found' });

            if (!isChecklistOwner(searchedChecklist, req.user!)) return res.status(401).json({ message: 'Permission denied' });

            const tasks = await Task.findAll({ where: { checklist_id: checklistId } });
            return res.status(200).json(tasks);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to show checklist' });
        }
    }

    public async searchChecklistTasks(req: Request<{ checklistId: number }>, res: Response) {
        const { description, initialDate, finalDate, priority, done, limitDate }: any = req.query;
        const { checklistId } = req.params;


        try {

            let checklistToValidate = await Checklist.findByPk(checklistId);

            if (!checklistToValidate) return res.status(404).json({ message: 'Checklist not found' })

            if (!isChecklistOwner(checklistToValidate, req.user!)) return res.status(200).json({ message: 'Permission denied' });


            //DATE TRATAMENT
            let initialDateConverted;
            let finalDateConverted;
            let limitDateConverted;


            if (initialDate)
                initialDateConverted = moment(initialDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (finalDate)
                finalDateConverted = moment(finalDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (limitDate)
                limitDateConverted = moment(limitDate, 'DD/MM/YYYY').format('YYYY-MM-DD');


            let sql = `select T.* from tb_tasks as T, tb_checklists as C where T.checklist_id = C.checklist_id and T.checklist_id = ${checklistId}`;

            if (initialDateConverted && finalDateConverted) sql += ` and date(created_at) >= '${initialDateConverted}' and date(created_at) <= '${finalDateConverted}'`;

            if (limitDateConverted) sql += ` and date(limit_date) = '${limitDateConverted}'`;

            if (priority) sql += ` and priority = '${priority}'`;

            if (done) sql += ` and done = '${done}'`;

            if (description) sql += ` and description like '%${description}%'`;


            const tasks = await Task.sequelize?.query(sql);

            res.status(200).json(tasks![0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to search task' });
        }
    }
}


export default new TaskController;