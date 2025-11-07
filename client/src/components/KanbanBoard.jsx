import Column from './Column.jsx';

const KanbanBoard = ({ columns, onCreateTask, onDeleteTask }) => (
  <div className="board">
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
