import { IChecklist } from "../models/Checklist";
import { ITask } from '../models/Task';

export const verifyTaskPriority = (priority: number) => {
    let isValidPriority = [0, 1].includes(Number(priority));
    return isValidPriority;
}