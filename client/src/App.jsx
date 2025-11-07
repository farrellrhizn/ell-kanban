import './App.css';
import KanbanBoard from './components/KanbanBoard.jsx';
import { useKanbanData } from './hooks/useKanbanData.js';

const App = () => {
  const { data, loading, error, createTask, deleteTask } = useKanbanData();

  if (loading) {
    return <main className="max-w-7xl mx-auto px-6 py-8 text-slate-900 bg-slate-50 min-h-screen">Memuat data...</main>;
  }

  if (error) {
    return <main className="max-w-7xl mx-auto px-6 py-8 text-red-700 bg-slate-50 min-h-screen">Terjadi kesalahan: {error}</main>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 text-slate-900 bg-slate-50 min-h-screen">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="inline-flex px-3 py-1 bg-slate-200 rounded-full text-xs uppercase font-semibold tracking-wide text-slate-600">
            PERN Stack
          </p>
          <h1 className="text-3xl font-bold mt-2">Ell Kanban</h1>
          <p className="text-slate-600 mt-1">Belajar PostgreSQL + Express + React + Node</p>
        </div>
      </header>
      <KanbanBoard columns={data} onCreateTask={createTask} onDeleteTask={deleteTask} />
    </main>
  );
};

export default App;
