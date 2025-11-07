import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

const Column = ({ column, onCreateTask, onDeleteTask }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateTask({ columnId: column.id, title });
    setTitle('');
  };

  return (
    <section className="column">
      <header>
        <h2>{column.title}</h2>
        <span>{column.tasks.length} task</span>
      </header>

      <div className="column__tasks">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} />
        ))}
      </div>

      <form className="column__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tambah task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Tambah</button>
      </form>
    </section>
  );
};

export default Column;
