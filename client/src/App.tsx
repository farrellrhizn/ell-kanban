import './App.css';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { useKanbanData } from './hooks/useKanbanData';
import { useAuth } from './hooks/useAuth';

type ThemeMode = 'light' | 'dark';

const App = (): JSX.Element => {
  const { data, loading, error, createTask, deleteTask, updateTask, reload } = useKanbanData();
  const { user, authLoading: authPending, authError, login, logout, clearAuthError } = useAuth();

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('ell-kanban-theme') as ThemeMode | null;
    return saved ?? 'dark';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginDisplayName, setLoginDisplayName] = useState('');

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

  const handleMoveTask = async (taskId: number, newColumnId: number, newPosition: number) => {
    if (!user) return;
    await updateTask(taskId, {
      columnId: newColumnId,
      position: newPosition
    });
  };

  const handleCreateTaskWithAssignee = useCallback(
    async (payload: Parameters<typeof createTask>[0]) => {
      const finalPayload =
        payload.assigneeId === undefined && user
          ? { ...payload, assigneeId: user.id }
          : payload;
      await createTask(finalPayload);
    },
    [createTask, user]
  );

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginEmail.trim()) return;
    try {
      await login({
        email: loginEmail.trim(),
        displayName: loginDisplayName.trim() || undefined
      });
      setLoginEmail('');
      setLoginDisplayName('');
    } catch {
      // Error already ditangani oleh useAuth
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleEmailChange = (value: string) => {
    if (authError) clearAuthError();
    setLoginEmail(value);
  };

  const handleNameChange = (value: string) => {
    if (authError) clearAuthError();
    setLoginDisplayName(value);
  };

  const canManageTasks = Boolean(user);

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
          <Button variant="secondary" onClick={() => { void reload(); }} disabled={loading}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Muat Ulang
          </Button>
          <Button variant="outline" onClick={handleThemeToggle}>
            {themeMode === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
          </Button>
        </div>
        <div className="app-header__auth">
          {user ? (
            <div className="auth-status">
              <div className="auth-status__info">
                <strong>{user.displayName}</strong>
                <span>{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={authPending}>
                Logout
              </Button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(event) => handleEmailChange(event.target.value)}
                required
                disabled={authPending}
              />
              <Input
                type="text"
                placeholder="Nama tampilan (opsional)"
                value={loginDisplayName}
                onChange={(event) => handleNameChange(event.target.value)}
                disabled={authPending}
              />
              <Button type="submit" size="sm" disabled={authPending}>
                {authPending ? 'Memproses...' : 'Login'}
              </Button>
            </form>
          )}
          {authError && <p className="auth-error">{authError}</p>}
          {!user && <p className="auth-hint">Masuk untuk menambah dan mengubah task.</p>}
        </div>
      </header>
      
      <div className="board-container">
        <KanbanBoard
          columns={data}
          onCreateTask={handleCreateTaskWithAssignee}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          onMoveTask={handleMoveTask}
          canManageTasks={canManageTasks}
        />
      </div>
    </div>
  );
};

export default App;
