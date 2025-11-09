WITH upsert_user AS (
  INSERT INTO kanban_users (id, email, display_name, avatar_url)
  VALUES (1, 'admin@example.com', 'Project Owner', NULL)
  ON CONFLICT (id) DO NOTHING
  RETURNING id
),
ensure_user AS (
  SELECT id FROM upsert_user
  UNION
  SELECT id FROM kanban_users WHERE id = 1
)
INSERT INTO kanban_boards (id, owner_id, title, description, slug, color)
SELECT
  1,
  id,
  'Ell Kanban Board',
  'Board default untuk percobaan dan pengembangan lokal',
  'ell-kanban',
  '#2563eb'
FROM ensure_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO kanban_board_members (board_id, user_id, role)
VALUES (1, 1, 'owner')
ON CONFLICT (board_id, user_id) DO NOTHING;

INSERT INTO kanban_columns (id, board_id, title, position, wip_limit, color)
VALUES
  (1, 1, 'Backlog', 1, NULL, '#475569'),
  (2, 1, 'In Progress', 2, 3, '#0ea5e9'),
  (3, 1, 'Review', 3, 2, '#f97316'),
  (4, 1, 'Done', 4, NULL, '#10b981')
ON CONFLICT (id) DO NOTHING;

INSERT INTO kanban_tasks (id, column_id, assignee_id, title, description, priority, status, due_date, labels, position)
VALUES
  (1, 1, 1, 'Riset kebutuhan pengguna', 'Kumpulkan user stories inti untuk board', 'high', 'active', NOW()::date + 2, ARRAY['research'], 1),
  (2, 2, 1, 'Bangun API Kanban v1', 'CRUD kolom dan task + health check', 'urgent', 'active', NOW()::date + 1, ARRAY['backend'], 1),
  (3, 2, 1, 'Integrasi drag and drop', 'Gunakan @dnd-kit pada frontend', 'medium', 'blocked', NULL, ARRAY['frontend'], 2),
  (4, 3, 1, 'QA pass', 'Uji coba regression + screenshot', 'medium', 'active', NOW()::date + 4, ARRAY['qa'], 1),
  (5, 4, 1, 'Dokumentasi onboard', 'Lengkapi README dan panduan lingkungan', 'low', 'done', NOW()::date - 1, ARRAY['docs'], 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO kanban_labels (id, board_id, name, color)
VALUES
  (1, 1, 'frontend', '#f472b6'),
  (2, 1, 'backend', '#38bdf8'),
  (3, 1, 'docs', '#a78bfa')
ON CONFLICT (id) DO NOTHING;

INSERT INTO kanban_task_labels (task_id, label_id)
VALUES
  (2, 2),
  (3, 1),
  (5, 3)
ON CONFLICT (task_id, label_id) DO NOTHING;

INSERT INTO kanban_task_comments (task_id, author_id, body)
VALUES
  (2, 1, 'Pastikan endpoint PATCH menangani perpindahan kolom ya'),
  (3, 1, 'Cek ulang performa drag di mobile sebelum release')
ON CONFLICT DO NOTHING;

INSERT INTO kanban_task_activity (task_id, actor_id, action, payload)
VALUES
  (2, 1, 'status_change', '{"from":"backlog","to":"in_progress"}'),
  (5, 1, 'completed', '{"note":"Dokumentasi siap dibagikan"}')
ON CONFLICT DO NOTHING;

SELECT
  setval(pg_get_serial_sequence('kanban_users', 'id'), COALESCE((SELECT MAX(id) FROM kanban_users), 0) + 1, false),
  setval(pg_get_serial_sequence('kanban_boards', 'id'), COALESCE((SELECT MAX(id) FROM kanban_boards), 0) + 1, false),
  setval(pg_get_serial_sequence('kanban_columns', 'id'), COALESCE((SELECT MAX(id) FROM kanban_columns), 0) + 1, false),
  setval(pg_get_serial_sequence('kanban_tasks', 'id'), COALESCE((SELECT MAX(id) FROM kanban_tasks), 0) + 1, false),
  setval(pg_get_serial_sequence('kanban_labels', 'id'), COALESCE((SELECT MAX(id) FROM kanban_labels), 0) + 1, false);
