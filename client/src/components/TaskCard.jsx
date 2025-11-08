import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import Input from './ui/Input.jsx';
import Textarea from './ui/Textarea.jsx';

const TaskCard = ({ task, onDelete, onUpdate }) => {
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
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    
    await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });
    setIsEditModalOpen(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus task "${task.title}"?`)) {
      onDelete();
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
