import { Sequelize } from "sequelize";
import Checklist from "../models/Checklist";
import Task from "../models/Task";
import User from "../models/User";
const connection = new Sequelize({
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12345',
    database: 'db_todo_list',
    dialect: 'mysql'
});

User.start(connection);
Checklist.start(connection);
Task.start(connection);
User.associate(Checklist);
Checklist.associate(User, Task);

export default connection;