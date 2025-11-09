import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column';
import TaskCard from './TaskCard';
import type { ColumnWithTasks, Task } from '../types/kanban';
import type { CreateTaskPayload, UpdateTaskPayload } from '../api/kanban';

const parseTaskId = (id: UniqueIdentifier): number | null => {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    if (id.startsWith('task-')) {
      const parsed = Number(id.replace('task-', ''));
      return Number.isNaN(parsed) ? null : parsed;
    }
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const parseColumnId = (id: UniqueIdentifier): number | null => {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    if (id.startsWith('column-')) {
      const parsed = Number(id.replace('column-', ''));
      return Number.isNaN(parsed) ? null : parsed;
    }
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

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
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

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
    const taskId = parseTaskId(event.active.id);
    setActiveTaskId(taskId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTaskId(null);
      return;
    }

    const activeIdNumber = parseTaskId(active.id);
    const overTaskId = parseTaskId(over.id);
    const overColumnId = parseColumnId(over.id);

    if (activeIdNumber === null) {
      setActiveTaskId(null);
      return;
    }

    const activeTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === activeIdNumber);

    if (!activeTask) {
      setActiveTaskId(null);
      return;
    }

    // Moving to a different column
    if (overColumnId !== null) {
      await onMoveTask(activeTask.id, overColumnId, 0);
    }
    // Moving within the same column or to another task's position
    else if (overTaskId !== null) {
      const activeColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === activeIdNumber)
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overTaskId)
      );

      if (activeColumn && targetColumn) {
        if (activeColumn.id === targetColumn.id) {
          // Same column, reorder
          const oldIndex = activeColumn.tasks.findIndex((task) => task.id === activeIdNumber);
          const newIndex = activeColumn.tasks.findIndex((task) => task.id === overTaskId);
          
          if (oldIndex !== newIndex) {
            await onMoveTask(activeTask.id, targetColumn.id, newIndex);
          }
        } else {
          // Different column
          const newIndex = targetColumn.tasks.findIndex((task) => task.id === overTaskId);
          await onMoveTask(activeTask.id, targetColumn.id, newIndex);
        }
      }
    }

    setActiveTaskId(null);
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  const activeTask: Task | undefined = activeTaskId !== null
    ? columns.flatMap((col) => col.tasks).find((task) => task.id === activeTaskId)
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
