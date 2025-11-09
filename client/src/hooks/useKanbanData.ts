import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTask,
  deleteTask,
  fetchColumns,
  fetchTasks,
  updateTask,
  type CreateTaskPayload,
  type UpdateTaskPayload
} from '../api/kanban';
import type { Column, ColumnWithTasks, Task } from '../types/kanban';

const mapTasksToColumns = (columns: Column[], tasks: Task[]): ColumnWithTasks[] =>
  columns.map((column) => ({
    ...column,
    tasks: tasks
      .filter((task) => task.columnId === column.id)
      .sort((a, b) => a.position - b.position)
  }));

export const useKanbanData = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [columnsRes, tasksRes] = await Promise.all([fetchColumns(), fetchTasks()]);
      setColumns(columnsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const data = useMemo(() => mapTasksToColumns(columns, tasks), [columns, tasks]);

  const handleCreateTask = useCallback(
    async (payload: CreateTaskPayload) => {
      await createTask(payload);
      await load();
    },
    [load]
  );

  const handleUpdateTask = useCallback(
    async (id: number, payload: UpdateTaskPayload) => {
      await updateTask(id, payload);
      await load();
    },
    [load]
  );

  const handleDeleteTask = useCallback(
    async (id: number) => {
      await deleteTask(id);
      await load();
    },
    [load]
  );

  return {
    data,
    loading,
    error,
    reload: load,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask
  };
};
