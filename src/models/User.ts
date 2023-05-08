import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

export default class User extends Model {
    declare user_id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare created_at: string;
    declare updated_at: string;

    public static start(connection: Sequelize) {
        return User.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updated_at: {
                    type: DataTypes.DATE, 
                    allowNull: false
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
        this.hasMany(Checklist, { foreignKey: 'user_id', as: 'checklists', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}