import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, column_id, title, description, position
       FROM kanban_tasks ORDER BY column_id, position`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data task' });
  }
});

router.post('/', async (req, res) => {
  const { columnId, title, description } = req.body;

  if (!columnId || !title) {
    return res.status(400).json({ message: 'columnId dan title wajib diisi' });
  }

  try {
    const result = await query(
      `INSERT INTO kanban_tasks (column_id, title, description, position)
       VALUES ($1, $2, $3,
         COALESCE(
           (SELECT COALESCE(MAX(position), 0) + 1 FROM kanban_tasks WHERE column_id = $1),
           1
         )
       )
       RETURNING id, column_id AS "columnId", title, description, position`,
      [columnId, title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat task' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, columnId, position } = req.body;

  if (!title && !description && columnId === undefined && position === undefined) {
    return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
  }

  try {
    const result = await query(
      `UPDATE kanban_tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           column_id = COALESCE($3, column_id),
           position = COALESCE($4, position)
       WHERE id = $5
       RETURNING id, column_id AS "columnId", title, description, position`,
      [title, description, columnId, position, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM kanban_tasks WHERE id = $1', [id]);

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus task' });
  }
});

export default router;
