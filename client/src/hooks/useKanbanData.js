import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, fetchColumns, fetchTasks, updateTask } from '../api/kanban.js';

const mapTasksToColumns = (columns, tasks) =>
  columns.map((column) => ({
    ...column,
    tasks: tasks
      .filter((task) => Number(task.column_id || task.columnId) === column.id)
      .sort((a, b) => a.position - b.position)
  }));

export const useKanbanData = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [columnsRes, tasksRes] = await Promise.all([fetchColumns(), fetchTasks()]);
      setColumns(columnsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const data = useMemo(() => mapTasksToColumns(columns, tasks), [columns, tasks]);

  const handleCreateTask = useCallback(async (payload) => {
    await createTask(payload);
    await load();
  }, [load]);

  const handleUpdateTask = useCallback(async (id, payload) => {
    await updateTask(id, payload);
    await load();
  }, [load]);

  const handleDeleteTask = useCallback(async (id) => {
    await deleteTask(id);
    await load();
  }, [load]);

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
