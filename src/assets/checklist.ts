import { IChecklist } from "../models/Checklist";
import { IUser } from "../models/User";

export const isChecklistOwner = (checklist: IChecklist, user: IUser) => {
    let isOwner = checklist.user_id == user.user_id;
    return isOwner;
}