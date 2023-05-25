import { Request, Response } from "express";
import moment from "moment";

import { verifyTaskPriority } from '../helpers/task';
import { ITask } from "../interfaces/ITask";
import Task from "../models/Task";
import Checklist from "../models/Checklist";

class TaskController {
    public async create(req: Request, res: Response) {
        const { description, limitDate, priority } = req.body;
        const { checklistId } = req.params;
        const userId = req.user?.user_id;

        try {

            if (!verifyTaskPriority(priority))
                return res.status(400).json({ message: 'Invalid priority' });

            const checklistToValidate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: userId } });

            if (!checklistToValidate)
                return res.status(404).json({ error: 'Checklist not found' });

            let taskLimitDate: string | null = '';

            if (limitDate) {
                taskLimitDate = limitDate.replace(/-/g, '\/');
            } else {
                taskLimitDate = null;
            }

            await Task.create({ description, limit_date: taskLimitDate, priority, checklist_id: checklistId });

            return res.status(200).json({ message: 'Task created successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to create task' });
        }
    }

    public async update(req: Request, res: Response) {
        const { checklistId, taskId } = req.params;
        const { description, limitDate, priority } = req.body;
        const userId = req.user?.user_id;

        try {

            if (!verifyTaskPriority(priority))
                return res.status(400).json({ message: 'Invalid priority' });

            const checklistToValidate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: userId } });

            const taskToValidate = await Task.findOne({ where: { task_id: taskId, checklist_id: checklistId } });

            if (!checklistToValidate)
                return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate)
                return res.status(404).json({ message: 'Task not found' });

            let taskLimitDate: string | null;

            if (limitDate) {
                taskLimitDate = limitDate.replace(/-/g, '\/');
            } else {
                taskLimitDate = null;
            }

            await Task.update({ description, limit_date: taskLimitDate, priority }, { where: { task_id: taskId } });

            return res.status(200).json({ message: 'Task successfully updated' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }

    public async delete(req: Request, res: Response) {
        const { checklistId, taskId } = req.params;

        try {

            const checklistToValidate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id } });

            const taskToValidate = await Task.findOne({ where: { task_id: taskId, checklist_id: checklistId } });

            if (!checklistToValidate)
                return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate)
                return res.status(404).json({ message: 'Task not found' });



            await Task.destroy({ where: { task_id: taskId } });

            res.status(200).json({ message: 'Task successfully deleted' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }

    public async searchChecklistTasks(req: Request, res: Response) {
        const { description, priority, done }: any = req.query;
        const { checklistId } = req.params;


        try {
            const checklistToValidate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id } });

            if (!checklistToValidate)
                return res.status(404).json({ message: 'Checklist not found' });

            const searchedTasks = await Task.findTasksByFilters({ description, priority, done, checklistId });

            return res.status(200).json(searchedTasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to search task' });
        }
    }


    public async setTaskAsDone(req: Request, res: Response) {
        let { checklistId, taskId } = req.params;


        try {

            const checklistToValidate = await Checklist.findOne({ where: { checklist_id: checklistId, user_id: req.user?.user_id } });

            const taskToValidate = await Task.findOne({ where: { task_id: taskId, checklist_id: checklistId } });

            if (!checklistToValidate)
                return res.status(404).json({ message: 'Checklist not found' });

            if (!taskToValidate)
                return res.status(404).json({ message: 'Task not found' });

            await Task.update({ done: !taskToValidate.done }, { where: { task_id: taskId } });

            res.status(200).json({ message: 'Task successfully updated' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to update task' });
        }
    }

    public async searchTasksWithShortDeadlineOrLate(req: Request, res: Response) {
        const userId = req.user?.user_id ?? null;

        try {
            let tasksWithShortDeadlineOrLate: ITask[] = await Task.findTasksWithShortDeadlineOrLate({ userId });
            return res.status(200).json(tasksWithShortDeadlineOrLate);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to search tasks' });
        }
    }
}


export default new TaskController();