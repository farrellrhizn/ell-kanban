import axios from 'axios';
import type { Column, Task, TaskPriority, TaskStatus } from '../types/kanban';

export interface CreateTaskPayload {
  columnId: number;
  title: string;
  description?: string;
  assigneeId?: number | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  labels?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  position?: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export const fetchColumns = () => api.get<Column[]>('/api/columns');
export const fetchTasks = () => api.get<Task[]>('/api/tasks');
export const createTask = (payload: CreateTaskPayload) => api.post<Task>('/api/tasks', payload);
export const updateTask = (id: number, payload: UpdateTaskPayload) => api.patch<Task>(`/api/tasks/${id}`, payload);
export const deleteTask = (id: number) => api.delete<void>(`/api/tasks/${id}`);

export default api;
