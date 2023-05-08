import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

export default class Checklist extends Model {
    declare checklist_id: number;
    declare name: string;
    declare created_at: string;
    declare updated_at: string;
    declare owner_id: string;

    public static start(connection: Sequelize) {
        return this.init(
            {
                checklist_id: {
                    type: DataTypes.INTEGER,
                },
                name: {
                    type: DataTypes.STRING,
                },
                created_at: {
                    type: DataTypes.DATE,
                },
                updated_at: {
                    type: DataTypes.DATE,
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

    public static associate(User: ModelStatic<Model>, Task: ModelStatic<Model>) {
        this.belongsTo(User, { foreignKey: 'user_id', as: 'owner', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        this.hasMany(Task, { foreignKey: 'checklist_id', as: 'tasks', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}