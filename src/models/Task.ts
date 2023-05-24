import moment from "moment";
import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import { ITask } from "../interfaces/ITask";

export interface ISearchTaskDTO {
    description: string;
    priority: string;
    done: string;
    checklistId: string;
}


export default class Task extends Model implements ITask {
    declare task_id: number;
    declare description: string;
    declare done: number;
    declare priority: number;
    declare limit_date: string;
    declare created_at: string;
    declare updated_at: string;
    declare checklist_id: number;

    public static start(connection: Sequelize) {
        return this.init(
            {
                task_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },

                description: DataTypes.STRING,

                done: {
                    type: DataTypes.TINYINT,
                    defaultValue: 0
                },

                priority: DataTypes.INTEGER,

                limit_date: DataTypes.DATE,

                created_at: DataTypes.DATE,

                updated_at: DataTypes.DATE
            },
            {
                sequelize: connection,
                freezeTableName: true,
                modelName: 'tb_tasks',
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        );
    }

    public static associate(Checklist: ModelStatic<Model>) {
        this.belongsTo(Checklist, { foreignKey: 'checklist_id', as: 'checklist', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }

    public static async findTasksWithShortDeadlineOrLate(userId: number | null) {
        const currentDate = moment().startOf('day');
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

        return tasksWithShortDeadline;
    }

    public static async findTasksByFilters({description, priority, done, checklistId}: ISearchTaskDTO) {
        let sql = `select T.* from tb_tasks as T, tb_checklists as C where T.checklist_id = C.checklist_id and T.checklist_id = ${checklistId}`;

        if (priority) sql += ` and T.priority = '${priority}'`;

        if (done) sql += ` and T.done = '${done}'`;

        if (description) sql += ` and T.description like '%${description}%'`;

        const tasks = await Task.sequelize?.query(sql);
        return tasks![0];
    }
}