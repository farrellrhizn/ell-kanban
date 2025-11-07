const TaskCard = ({ task, onDelete }) => (
  <article className="task">
    <header>
      <h3>{task.title}</h3>
      <button type="button" onClick={onDelete}>
        ×
      </button>
    </header>
    {task.description && <p>{task.description}</p>}
  </article>
);

export default TaskCard;
