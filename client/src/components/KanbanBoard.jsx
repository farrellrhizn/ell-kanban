import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column.jsx';
import TaskCard from './TaskCard.jsx';

const KanbanBoard = ({ columns, onCreateTask, onDeleteTask, onUpdateTask, onMoveTask }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === active.id);

    const overTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === over.id);

    const overColumn = columns.find((col) => col.id === over.id);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Moving to a different column
    if (overColumn) {
      await onMoveTask(activeTask.id, overColumn.id, 0);
    }
    // Moving within the same column or to another task's position
    else if (overTask) {
      const activeColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === active.id)
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === over.id)
      );

      if (activeColumn && targetColumn) {
        if (activeColumn.id === targetColumn.id) {
          // Same column, reorder
          const oldIndex = activeColumn.tasks.findIndex((task) => task.id === active.id);
          const newIndex = activeColumn.tasks.findIndex((task) => task.id === over.id);
          
          if (oldIndex !== newIndex) {
            await onMoveTask(activeTask.id, targetColumn.id, newIndex);
          }
        } else {
          // Different column
          const newIndex = targetColumn.tasks.findIndex((task) => task.id === over.id);
          await onMoveTask(activeTask.id, targetColumn.id, newIndex);
        }
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId
    ? columns.flatMap((col) => col.tasks).find((task) => task.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-grid">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onCreateTask={onCreateTask}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="task-card task-card--dragging">
            <div className="task-card__tape" />
            <header className="task-card__header">
              <h3 className="task-card__title">{activeTask.title}</h3>
            </header>
            {activeTask.description && (
              <p className="task-card__description">{activeTask.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
