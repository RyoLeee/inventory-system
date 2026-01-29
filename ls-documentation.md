# LOGIC NOLEP – Inventory System (IS)

Project ini adalah backend system **Inventory System (IS)** yang sepenuhnya berbasis backend tanpa frontend web.  
Seluruh interaksi dilakukan melalui **CLI Interface** di terminal.

CLI ini berfungsi sebagai “frontend sederhana” yang menghubungkan user langsung ke backend melalui GraphQL.  
Setiap input yang diketik user di CLI akan langsung dikirim ke backend dan diproses oleh sistem.

Alur besarnya:


Dengan konsep ini, seluruh logika inti ada di backend.  
CLI hanya menjadi media interaksi.

---

## Cara Menjalankan Project

Urutan menjalankan project ini:

1. Generate & sinkronkan database schema  
   Pastikan Prisma sudah membaca schema dan database sudah sesuai.

2. Jalankan server utama: node index.js

3. Jalankan CLI Interface: node cli-interface.js


Setelah itu, CLI akan menampilkan menu seperti:
- Register
- Login
- Users
- Products
- Categories
- Orders

Semua fitur backend diakses dari menu ini.

---

## Konsep Sistem

Setiap aksi user selalu melalui alur berikut:

1. User memilih menu di CLI  
2. CLI mengirim request ke GraphQL API  
3. Resolver menerima request  
4. Resolver memanggil Service  
5. Service menjalankan business logic  
6. Prisma mengakses database  
7. Hasil dikembalikan ke CLI  

Dengan struktur ini:
- Semua logic ada di backend  
- CLI hanya penghubung  
- Backend bisa diuji tanpa frontend web  

---

## Authentication

- Saat Register / Login, backend mengembalikan token
- Token disimpan oleh CLI
- Semua request berikutnya otomatis membawa token tersebut
- Server membaca token dan menentukan user

Kondisi:
- Tidak ada token → UNAUTHORIZED  
- Token invalid → UNAUTHORIZED  
- Token valid → user dikenali  

Beberapa fitur hanya bisa diakses admin, misalnya melihat semua user.

---

## Validasi Input

Semua input divalidasi sebelum masuk ke logic utama:

- Email harus valid  
- Field wajib tidak boleh kosong  
- Struktur data harus sesuai  

Jika validasi gagal:
- Proses langsung dihentikan  
- Service tidak dijalankan  
- User mendapat error yang jelas  

Tujuan:
- Menjaga data tetap bersih  
- Mencegah bug dari input aneh  
- Memudahkan debugging  

---

## Error Handling

Project ini menggunakan sistem error terpusat dengan format konsisten.

Setiap error memiliki:
- Message  
- Code  
- HTTP-like status  
- Detail (opsional)  

Jenis error:
- `VALIDATION_ERROR` → input salah  
- `UNAUTHORIZED` → belum login  
- `FORBIDDEN` → tidak punya akses  
- `INTERNAL_SERVER_ERROR` → kesalahan logic  


