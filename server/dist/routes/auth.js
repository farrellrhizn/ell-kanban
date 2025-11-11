import { Router } from 'express';
import { query } from '../db.js';
const router = Router();
const createToken = (userId) => Buffer.from(`${userId}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2)}`).toString('base64url');
router.post('/login', async (req, res) => {
    const { email, displayName } = req.body;
    if (!email?.trim()) {
        return res.status(400).json({ message: 'Email wajib diisi' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const fallbackDisplayName = normalizedEmail.split('@')[0] ?? 'Pengguna Baru';
    try {
        const existingUser = await query(`SELECT
         id,
         email,
         display_name AS "displayName",
         avatar_url AS "avatarUrl",
         timezone
       FROM kanban_users
       WHERE email = $1`, [normalizedEmail]);
        let user = existingUser.rows[0];
        if (!user) {
            const insertedUser = await query(`INSERT INTO kanban_users (email, display_name)
         VALUES ($1, $2)
         RETURNING
           id,
           email,
           display_name AS "displayName",
           avatar_url AS "avatarUrl",
           timezone`, [normalizedEmail, displayName?.trim() || fallbackDisplayName]);
            user = insertedUser.rows[0];
        }
        const token = createToken(user.id);
        res.json({ user, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal melakukan login' });
    }
});
router.post('/logout', (_req, res) => {
    res.json({ message: 'Logout berhasil' });
});
export default router;
