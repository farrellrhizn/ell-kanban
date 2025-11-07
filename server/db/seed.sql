INSERT INTO kanban_columns (title, position)
VALUES
  ('Todo', 1),
  ('In Progress', 2),
  ('Done', 3)
ON CONFLICT DO NOTHING;

INSERT INTO kanban_tasks (column_id, title, description, position)
VALUES
  (1, 'Setup project', 'Inisialisasi repository dan struktur folder', 1),
  (2, 'REST API', 'Buat endpoint CRUD untuk task dan column', 1),
  (3, 'Deploy', 'Siapkan environment produksi', 1)
ON CONFLICT DO NOTHING;
