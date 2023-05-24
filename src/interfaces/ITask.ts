export interface ITask {
    task_id: number;
    description: string;
    done: number;
    priority: number;
    limit_date: string;
    created_at: string;
    updated_at: string;
    checklist_id: number;
}