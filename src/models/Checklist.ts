import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

import { IChecklist } from '../interfaces/IChecklist';


export default class Checklist extends Model implements IChecklist {
    declare checklist_id: number;
    declare name: string;
    declare created_at: string;
    declare updated_at: string;
    declare user_id: number;

    public static start(connection: Sequelize) {
        return this.init(
            {
                checklist_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },

                name: DataTypes.STRING,

                created_at: DataTypes.DATE,

                updated_at: DataTypes.DATE
            },
            {
                sequelize: connection,
                freezeTableName: true,
                modelName: 'tb_checklists',
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        );
    }

    public static associate(User: ModelStatic<Model>, Task: ModelStatic<Model>) {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'owner', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        this.hasMany(Task, { foreignKey: 'checklist_id', as: 'tasks', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}