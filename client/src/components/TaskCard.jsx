const TaskCard = ({ task, onDelete }) => (
  <article className="bg-slate-50 rounded-xl p-3 border border-slate-200">
    <header className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-slate-900 flex-1">{task.title}</h3>
      <button 
        type="button" 
        onClick={onDelete}
        className="text-slate-400 hover:text-slate-600 text-xl leading-none ml-2 bg-transparent border-none cursor-pointer transition-colors"
      >
        ×
      </button>
    </header>
    {task.description && <p className="text-sm text-slate-600">{task.description}</p>}
  </article>
);

export default TaskCard;
