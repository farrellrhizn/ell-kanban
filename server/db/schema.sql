CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS kanban_users (
  id SERIAL PRIMARY KEY,
  email CITEXT NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kanban_boards (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES kanban_users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(120) NOT NULL UNIQUE,
  color VARCHAR(16),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kanban_board_members (
  board_id INTEGER NOT NULL REFERENCES kanban_boards(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES kanban_users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  notification_level VARCHAR(20) NOT NULL DEFAULT 'mention',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (board_id, user_id)
);

CREATE TABLE IF NOT EXISTS kanban_columns (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL DEFAULT 1 REFERENCES kanban_boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 1,
  wip_limit INTEGER CHECK (wip_limit IS NULL OR wip_limit > 0),
  color VARCHAR(16),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kanban_columns_board_position ON kanban_columns (board_id, position);

CREATE TABLE IF NOT EXISTS kanban_tasks (
  id SERIAL PRIMARY KEY,
  column_id INTEGER NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  assignee_id INTEGER REFERENCES kanban_users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'done')),
  due_date DATE,
  labels TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::JSONB,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_column_position ON kanban_tasks (column_id, position);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_due_date ON kanban_tasks (due_date);

CREATE TABLE IF NOT EXISTS kanban_task_comments (
  id BIGSERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES kanban_users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON kanban_task_comments (task_id);

CREATE TABLE IF NOT EXISTS kanban_task_activity (
  id BIGSERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  actor_id INTEGER REFERENCES kanban_users(id) ON DELETE SET NULL,
  action VARCHAR(60) NOT NULL,
  payload JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON kanban_task_activity (task_id);

CREATE TABLE IF NOT EXISTS kanban_labels (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES kanban_boards(id) ON DELETE CASCADE,
  name VARCHAR(60) NOT NULL,
  color VARCHAR(16) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (board_id, name)
);

CREATE TABLE IF NOT EXISTS kanban_task_labels (
  task_id INTEGER NOT NULL REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  label_id INTEGER NOT NULL REFERENCES kanban_labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);
