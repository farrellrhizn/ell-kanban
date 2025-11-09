import { type FormEvent, type MouseEvent, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Modal from './ui/Modal';
import type { ColumnWithTasks } from '../types/kanban';
import type { CreateTaskPayload, UpdateTaskPayload } from '../api/kanban';

interface ColumnProps {
  column: ColumnWithTasks;
  onCreateTask: (payload: CreateTaskPayload) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  onUpdateTask: (id: number, payload: UpdateTaskPayload) => Promise<void>;
}

const Column = ({ column, onCreateTask, onDeleteTask, onUpdateTask }: ColumnProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskIds = column.tasks.map((task) => task.id);

  const handleQuickSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateTask({ columnId: column.id, title: title.trim() });
    setTitle('');
  };

  const handleDetailedSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await onCreateTask({
      columnId: column.id,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddModalOpen(true);
  };

  return (
    <>
      <section className="kanban-column">
        <header className="kanban-column__header">
          <div className="kanban-column__header-content">
            <div className={`column-indicator column-indicator--${column.id}`} />
            <h2 className="kanban-column__title">{column.title}</h2>
          </div>
          <span className="kanban-task-count">{column.tasks.length}</span>
        </header>

        <div ref={setNodeRef} className="kanban-tasks">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task.id)}
                onUpdate={onUpdateTask}
              />
            ))}
          </SortableContext>
        </div>

        <div className="task-form-container">
          <form className="task-form" onSubmit={handleQuickSubmit}>
            <Input
              type="text"
              placeholder="Tambah task cepat..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="task-input"
            />
            <Button type="submit" size="sm" className="whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={openAddModal}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah dengan Detail
          </Button>
        </div>
      </section>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Tambah Task ke ${column.title}`}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleDetailedSubmit}>
              Tambah Task
            </Button>
          </div>
        }
      >
        <form onSubmit={handleDetailedSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="new-title">
              Judul Task
            </label>
            <Input
              id="new-title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Masukkan judul task"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="new-description">
              Deskripsi (opsional)
            </label>
            <Textarea
              id="new-description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Tambahkan deskripsi..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Column;
