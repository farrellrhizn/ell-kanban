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
         t.id,
         t.column_id AS "columnId",
         t.assignee_id AS "assigneeId",
         t.title,
         t.description,
         t.priority,
         t.status,
         t.due_date AS "dueDate",
         t.labels,
         t.metadata,
         t.position
       FROM kanban_tasks t
       JOIN kanban_columns c ON c.id = t.column_id
       WHERE c.board_id = $1
       ORDER BY c.position, t.position`, [boardId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data task' });
    }
});
router.post('/', async (req, res) => {
    const { columnId, assigneeId, title, description, priority, status, dueDate, labels, metadata } = req.body;
    if (!columnId || !title?.trim()) {
        return res.status(400).json({ message: 'columnId dan title wajib diisi' });
    }
    const metadataPayload = metadata !== undefined ? JSON.stringify(metadata) : null;
    try {
        const result = await query(`INSERT INTO kanban_tasks (
         column_id,
         assignee_id,
         title,
         description,
         priority,
         status,
         due_date,
         labels,
         metadata,
         position
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         COALESCE($5, 'medium'),
         COALESCE($6, 'active'),
         $7,
         COALESCE($8, ARRAY[]::TEXT[]),
         COALESCE($9::JSONB, '{}'::JSONB),
         COALESCE(
           (SELECT COALESCE(MAX(position), 0) + 1 FROM kanban_tasks WHERE column_id = $1),
           1
         )
       )
       RETURNING
         id,
         column_id AS "columnId",
         assignee_id AS "assigneeId",
         title,
         description,
         priority,
         status,
         due_date AS "dueDate",
         labels,
         metadata,
         position`, [
            columnId,
            assigneeId ?? null,
            title.trim(),
            description ?? null,
            priority ?? null,
            status ?? null,
            dueDate ?? null,
            labels ?? null,
            metadataPayload
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat task' });
    }
});
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'ID task tidak valid' });
    }
    const { title, description, columnId, position, assigneeId, priority, status, dueDate, labels, metadata } = req.body;
    const metadataPayload = metadata !== undefined ? JSON.stringify(metadata) : null;
    if ([
        title,
        description,
        columnId,
        position,
        assigneeId,
        priority,
        status,
        dueDate,
        labels,
        metadata
    ].every((value) => value === undefined)) {
        return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
    }
    try {
        const result = await query(`UPDATE kanban_tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           column_id = COALESCE($3, column_id),
           position = COALESCE($4, position),
           assignee_id = COALESCE($5, assignee_id),
           priority = COALESCE($6, priority),
           status = COALESCE($7, status),
           due_date = COALESCE($8, due_date),
           labels = COALESCE($9, labels),
           metadata = COALESCE($10::JSONB, metadata),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING
         id,
         column_id AS "columnId",
         assignee_id AS "assigneeId",
         title,
         description,
         priority,
         status,
         due_date AS "dueDate",
         labels,
         metadata,
         position`, [
            title?.trim() ?? null,
            description ?? null,
            columnId ?? null,
            position ?? null,
            assigneeId ?? null,
            priority ?? null,
            status ?? null,
            dueDate ?? null,
            labels ?? null,
            metadataPayload,
            numericId
        ]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Task tidak ditemukan' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui task' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'ID task tidak valid' });
    }
    try {
        const result = await query('DELETE FROM kanban_tasks WHERE id = $1', [numericId]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Task tidak ditemukan' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus task' });
    }
});
export default router;
