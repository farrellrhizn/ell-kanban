import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, title, position FROM kanban_columns ORDER BY position');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data kolom' });
  }
});

router.post('/', async (req, res) => {
  const { title, position } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title tidak boleh kosong' });
  }

  try {
    const result = await query(
      `INSERT INTO kanban_columns (title, position)
       VALUES ($1, COALESCE($2, (SELECT COALESCE(MAX(position), 0) + 1 FROM kanban_columns)))
       RETURNING id, title, position`,
      [title, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat kolom' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, position } = req.body;

  if (!title && position === undefined) {
    return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
  }

  try {
    const result = await query(
      `UPDATE kanban_columns
       SET title = COALESCE($1, title),
           position = COALESCE($2, position)
       WHERE id = $3
       RETURNING id, title, position`,
      [title, position, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Kolom tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui kolom' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM kanban_columns WHERE id = $1', [id]);

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Kolom tidak ditemukan' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus kolom' });
  }
});

export default router;
