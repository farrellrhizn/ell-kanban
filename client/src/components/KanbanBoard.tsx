import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column';
import TaskCard from './TaskCard';
import type { ColumnWithTasks, Task } from '../types/kanban';
import type { CreateTaskPayload, UpdateTaskPayload } from '../api/kanban';

interface KanbanBoardProps {
  columns: ColumnWithTasks[];
  onCreateTask: (payload: CreateTaskPayload) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  onUpdateTask: (id: number, payload: UpdateTaskPayload) => Promise<void>;
  onMoveTask: (taskId: number, columnId: number, position: number) => Promise<void>;
}

const KanbanBoard = ({
  columns,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
  onMoveTask
}: KanbanBoardProps): JSX.Element => {
  const [activeId, setActiveId] = useState<number | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    const identifier = Number(event.active.id);
    setActiveId(Number.isNaN(identifier) ? null : identifier);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIdNumber = Number(active.id);
    const overIdNumber = Number(over.id);

    const activeTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === activeIdNumber);

    const overTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === overIdNumber);

    const overColumn = columns.find((col) => col.id === overIdNumber);

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
        col.tasks.some((task) => task.id === activeIdNumber)
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overIdNumber)
      );

      if (activeColumn && targetColumn) {
        if (activeColumn.id === targetColumn.id) {
          // Same column, reorder
          const oldIndex = activeColumn.tasks.findIndex((task) => task.id === activeIdNumber);
          const newIndex = activeColumn.tasks.findIndex((task) => task.id === overIdNumber);
          
          if (oldIndex !== newIndex) {
            await onMoveTask(activeTask.id, targetColumn.id, newIndex);
          }
        } else {
          // Different column
          const newIndex = targetColumn.tasks.findIndex((task) => task.id === overIdNumber);
          await onMoveTask(activeTask.id, targetColumn.id, newIndex);
        }
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask: Task | undefined = activeId
    ? columns.flatMap((col) => col.tasks).find((task) => task.id === activeId)
    : undefined;

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
