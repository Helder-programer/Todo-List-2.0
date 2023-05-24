import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { verifyTaskPriority } from '../helpers/task';
import Checklist from "../models/Checklist";
import moment from "moment";

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


            let sql = `select T.* from tb_tasks as T, tb_checklists as C where T.checklist_id = C.checklist_id and T.checklist_id = ${checklistId}`;

            if (priority) sql += ` and T.priority = '${priority}'`;

            if (done) sql += ` and T.done = '${done}'`;

            if (description) sql += ` and T.description like '%${description}%'`;

            const tasks = await Task.sequelize?.query(sql);


            res.status(200).json(tasks![0]);
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

    public async searchTasksWithShortDeadline(req: Request, res: Response) {
        const userId = req.user?.user_id;
        const currentDate = moment().startOf('day');

        try {
            const tasks = await Task.findAll({ include: { association: 'checklist', where: { user_id: userId } } });
            let tasksWithShortDeadline: ITask[] = [];

            tasks.forEach(currentTask => {
                let diffBetweenDays = moment(currentTask.limit_date).diff(currentDate, 'days', false);
                let isDone = !!currentTask.done;
                let isLateTask = moment(currentDate).diff(currentTask.limit_date, 'days', false) > 0;

                if ((diffBetweenDays <= 5 || isLateTask) && !isDone) {
                    tasksWithShortDeadline.push(currentTask);
                };
            });

            return res.status(200).json(tasksWithShortDeadline);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Problem to search tasks' });
        }
    }
}


export default new TaskController();