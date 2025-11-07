# Backend (Express + PostgreSQL)

## Menjalankan secara lokal

1. Buat file `.env` berdasarkan `.env.example` dan sesuaikan `DATABASE_URL`.
2. Jalankan perintah migrasi manual di PostgreSQL:
   ```sql
   \i db/schema.sql
   \i db/seed.sql
   ```
3. Install dependency lalu jalankan server.
   ```bash
   npm install
   npm run dev
   ```

Server akan berjalan pada `http://localhost:4000`.
