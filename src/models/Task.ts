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
                    primaryKey: true,
                    autoIncrement: true
                },

                description: DataTypes.STRING,

                done: DataTypes.INTEGER,

                priority: DataTypes.INTEGER,

                limit_date: DataTypes.DATE,

                created_at: DataTypes.DATE,

                updated_at: DataTypes.DATE
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