import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export interface IUser {
    user_id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}


export default class User extends Model implements IUser {
    declare user_id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare created_at: string;
    declare updated_at: string;

    public async isCorrectPassword(password: string): Promise<boolean> {
        let isEqualPassword: boolean = await bcrypt.compare(password, this.password);
        return isEqualPassword;
    }

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
                updatedAt: 'updated_at',
                hooks: {
                    beforeCreate: async function (user, options) {
                        const saltRounds = 10;
                        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                        user.password = hashedPassword;
                    }
                }
            }
        );
    }

    public static associate(Checklist: ModelStatic<Model>) {
        this.hasMany(Checklist, { foreignKey: 'user_id', as: 'checklists', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}