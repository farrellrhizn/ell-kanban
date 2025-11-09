export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'active' | 'blocked' | 'done';

export interface ColumnRecord {
  id: number;
  boardId: number;
  title: string;
  position: number;
  wipLimit: number | null;
  color: string | null;
}

export interface ColumnPayload {
  boardId?: number;
  title?: string;
  position?: number;
  wipLimit?: number | null;
  color?: string | null;
}

export interface TaskRecord {
  id: number;
  columnId: number;
  assigneeId: number | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  labels: string[];
  metadata: Record<string, unknown>;
  position: number;
}

export interface TaskPayload {
  columnId?: number;
  assigneeId?: number | null;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  labels?: string[];
  metadata?: Record<string, unknown>;
  position?: number;
}
