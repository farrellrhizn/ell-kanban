import './App.css';
import { useEffect, useState } from 'react';
import KanbanBoard from './components/KanbanBoard.jsx';
import Button from './components/ui/Button.jsx';
import { useKanbanData } from './hooks/useKanbanData.js';

const App = () => {
  const { data, loading, error, createTask, deleteTask, updateTask, reload } = useKanbanData();
  
  // Set dark mode sebagai default
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('ell-kanban-theme');
    return saved || 'dark'; // Default ke dark mode
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ell-kanban-theme', themeMode);
    }
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleMoveTask = async (taskId, newColumnId, newPosition) => {
    await updateTask(taskId, {
      column_id: newColumnId,
      position: newPosition
    });
  };

  if (loading) {
    return (
      <main className="app-shell status-message">
        <div className="loading-spinner" />
        <span>Memuat data...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell status-message status-error">
        <span>Terjadi kesalahan: {error}</span>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__info">
          <span className="tech-pill">PERN Stack</span>
          <h1>Ell Kanban</h1>
          <p>Belajar PostgreSQL + Express + React + Node</p>
        </div>
        <div className="app-header__actions">
          <Button variant="secondary" onClick={reload} disabled={loading}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Muat Ulang
          </Button>
          <Button variant="outline" onClick={handleThemeToggle}>
            {themeMode === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
          </Button>
        </div>
      </header>
      
      <div className="board-container">
        <KanbanBoard 
          columns={data} 
          onCreateTask={createTask} 
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          onMoveTask={handleMoveTask}
        />
      </div>
    </div>
  );
};

export default App;
