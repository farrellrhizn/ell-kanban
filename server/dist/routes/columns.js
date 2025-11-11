import { Router } from 'express';
import { query } from '../db.js';
const router = Router();
router.get('/', async (req, res) => {
    const boardIdParam = req.query.boardId;
    const boardId = boardIdParam ? Number(boardIdParam) : 1;
    if (Number.isNaN(boardId)) {
        return res.status(400).json({ message: 'boardId tidak valid' });
    }
    try {
        const result = await query(`SELECT
         id,
         board_id AS "boardId",
         title,
         position,
         wip_limit AS "wipLimit",
         color
       FROM kanban_columns
       WHERE board_id = $1
       ORDER BY position`, [boardId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data kolom' });
    }
});
router.post('/', async (req, res) => {
    const { title, position, boardId = 1, wipLimit, color } = req.body;
    if (!title?.trim()) {
        return res.status(400).json({ message: 'Title tidak boleh kosong' });
    }
    try {
        const result = await query(`INSERT INTO kanban_columns (board_id, title, position, wip_limit, color)
       VALUES (
         $1,
         $2,
         COALESCE(
           $3,
           (SELECT COALESCE(MAX(position), 0) + 1 FROM kanban_columns WHERE board_id = $1)
         ),
         $4,
         $5
       )
       RETURNING id,
                 board_id AS "boardId",
                 title,
                 position,
                 wip_limit AS "wipLimit",
                 color`, [boardId, title.trim(), position ?? null, wipLimit ?? null, color ?? null]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat kolom' });
    }
});
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'ID kolom tidak valid' });
    }
    const { title, position, boardId, wipLimit, color } = req.body;
    if ([title, position, boardId, wipLimit, color].every((value) => value === undefined)) {
        return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
    }
    try {
        const result = await query(`UPDATE kanban_columns
       SET title = COALESCE($1, title),
           position = COALESCE($2, position),
           board_id = COALESCE($3, board_id),
           wip_limit = COALESCE($4, wip_limit),
           color = COALESCE($5, color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id,
                 board_id AS "boardId",
                 title,
                 position,
                 wip_limit AS "wipLimit",
                 color`, [title?.trim() ?? null, position ?? null, boardId ?? null, wipLimit ?? null, color ?? null, numericId]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Kolom tidak ditemukan' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui kolom' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'ID kolom tidak valid' });
    }
    try {
        const result = await query('DELETE FROM kanban_columns WHERE id = $1', [numericId]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Kolom tidak ditemukan' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus kolom' });
    }
});
export default router;
