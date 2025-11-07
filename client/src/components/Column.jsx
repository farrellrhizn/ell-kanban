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
    <section className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-900/5 flex flex-col min-h-[300px]">
      <header className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-slate-900">{column.title}</h2>
        <span className="text-sm text-slate-500">{column.tasks.length} task</span>
      </header>

      <div className="flex flex-col gap-2 flex-1">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} />
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tambah task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Tambah
        </button>
      </form>
    </section>
  );
};

export default Column;
