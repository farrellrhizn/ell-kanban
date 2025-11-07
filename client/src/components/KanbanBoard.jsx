import Column from './Column.jsx';

const KanbanBoard = ({ columns, onCreateTask, onDeleteTask }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {columns.map((column) => (
      <Column
        key={column.id}
        column={column}
        onCreateTask={onCreateTask}
        onDeleteTask={onDeleteTask}
      />
    ))}
  </div>
);

export default KanbanBoard;
