import { IChecklist } from "../models/Checklist";
import { ITask } from '../models/Task';

export const verifyTaskChecklistOwner = (checklist: IChecklist, task: ITask) => {
    let isTaskChecklistOwner = checklist.checklist_id == task.checklist_id;
    return isTaskChecklistOwner;
}