# Backend (Express + PostgreSQL)

## Menjalankan secara lokal

1. Buat file `.env` berdasarkan `.env.example` dan sesuaikan `DATABASE_URL`.
2. Jalankan migrasi PostgreSQL:
   - **Via DBeaver**  
     - Buka connection ke database yang dituju.  
     - Klik kanan database → `SQL Editor` → `New Script`, lalu jalankan isi `db/schema.sql`.  
     - Setelah sukses, jalankan skrip baru untuk `db/seed.sql` agar data contoh terpasang.  
   - **Via psql CLI**
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
