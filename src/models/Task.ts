import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export default class Task extends Model {
    declare task_id: number;
    declare description: string;
    declare done: number;
    declare priority: number;
    declare limit_date: string;
    declare created_at: string;
    declare updated_at: string;

    public static start(connection: Sequelize) {
        return this.init(
            {
                task_id: {
                    type: DataTypes.INTEGER,
                },
                description: {
                    type: DataTypes.STRING,
                },
                done: {
                    type: DataTypes.INTEGER,
                },
                priority: {
                    type: DataTypes.INTEGER,
                },
                limit_date: {
                    type: DataTypes.DATE,
                },
                created_at: {
                    type: DataTypes.DATE,
                },
                updated_at: {
                    type: DataTypes.DATE
                }
            },
            {
                sequelize: connection,
                freezeTableName: true,
                modelName: 'tb_users',
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        );
    }

    public static associate(Checklist: ModelStatic<Model>) {
        this.belongsTo(Checklist, { foreignKey: 'checklist_id', as: 'checklist', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}