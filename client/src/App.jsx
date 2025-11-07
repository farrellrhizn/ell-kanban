import KanbanBoard from './components/KanbanBoard.jsx';
import { useKanbanData } from './hooks/useKanbanData.js';

const App = () => {
  const { data, loading, error, createTask, deleteTask } = useKanbanData();

  if (loading) {
    return <main className="container">Memuat data...</main>;
  }

  if (error) {
    return <main className="container error">Terjadi kesalahan: {error}</main>;
  }

  return (
    <main className="container">
      <header className="app-header">
        <div>
          <p className="badge">PERN Stack</p>
          <h1>Ell Kanban</h1>
          <p>Belajar PostgreSQL + Express + React + Node</p>
        </div>
      </header>
      <KanbanBoard columns={data} onCreateTask={createTask} onDeleteTask={deleteTask} />
    </main>
  );
};

export default App;
