import { type CSSProperties, type FormEvent, type MouseEvent, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import type { Task } from '../types/kanban';
import type { UpdateTaskPayload } from '../api/kanban';

interface TaskCardProps {
  task: Task;
  onDelete: () => Promise<void> | void;
  onUpdate: (id: number, payload: UpdateTaskPayload) => Promise<void>;
  canManageTasks: boolean;
}

const TaskCard = ({ task, onDelete, onUpdate, canManageTasks }: TaskCardProps): JSX.Element => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `task-${task.id}`, disabled: !canManageTasks });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (!canManageTasks && isEditModalOpen) {
      setIsEditModalOpen(false);
    }
  }, [canManageTasks, isEditModalOpen]);

  const handleEditSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!canManageTasks) return;
    if (!editTitle.trim()) return;

    const sanitizedDescription = editDescription.trim();
    await onUpdate(task.id, {
      title: editTitle.trim(),
      description: sanitizedDescription || undefined
    });
    setIsEditModalOpen(false);
  };

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!canManageTasks) return;
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!canManageTasks) return;
    if (window.confirm(`Hapus task "${task.title}"?`)) {
      await onDelete();
    }
  };

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
        {...attributes}
        {...listeners}
      >
        <div className="task-card__tape" />
        <div className="task-card__header">
          <h3 className="task-card__title">{task.title}</h3>
          <div className="task-card__actions">
            <button
              type="button"
              onClick={handleEditClick}
              className="task-card__action-btn"
              aria-label={`Edit ${task.title}`}
              disabled={!canManageTasks}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="task-card__action-btn task-card__delete-btn"
              aria-label={`Hapus ${task.title}`}
              disabled={!canManageTasks}
            >
              ×
            </button>
          </div>
        </div>
        {task.description && <p className="task-card__description">{task.description}</p>}
        <div className="task-card__grip">⋮⋮</div>
      </article>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSubmit}>
              Simpan
            </Button>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="edit-title">
              Judul Task
            </label>
            <Input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Masukkan judul task"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="edit-description">
              Deskripsi (opsional)
            </label>
            <Textarea
              id="edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Tambahkan deskripsi..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TaskCard;
