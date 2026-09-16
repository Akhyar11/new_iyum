# 💄 IYUM MakeOver — Sistem Rekomendasi Paket Make Up

Aplikasi Web Sistem Pendukung Keputusan (SPK) Rekomendasi Paket Rias Pengantin & Make Up untuk **IYUM MakeOver** menggunakan algoritma **Simple Additive Weighting (SAW)**.

---

## 📌 Tentang Proyek

Aplikasi ini dirancang untuk mempermudah calon pengantin dan klien dalam memilih paket tata rias yang paling sesuai dengan preferensi, anggaran, dan kebutuhan acara mereka. Sistem menggunakan metode **Simple Additive Weighting (SAW)** untuk memberikan rekomendasi yang objektif berdasarkan bobot kriteria.

### 🌟 Fitur Utama
1. **Katalog & Pricelist Resmi 2025**:
   - Menampilkan seluruh paket make up resmi IYUM MakeOver lengkap dengan foto dokumentasi asli, rincian busana, melati, softlens, retouch, dan rincian harga.
2. **Sistem Rekomendasi Cerdas (Metode SAW)**:
   - Pengunjung mengisi kuesioner kebutuhan (Budget, Jumlah Acara/Busana, Kebutuhan Ibu/Besan, Lokasi/Transport, Tambahan Layanan).
   - Sistem melakukan normalisasi matriks dan pembobotan untuk menghasilkan skor preferensi (0 - 100%) dan urutan rekomendasi terbaik.
3. **Pemesanan Langsung ke WhatsApp**:
   - Setiap paket dan hasil rekomendasi terhubung langsung dengan WhatsApp resmi IYUM MakeOver (`+62 822-4981-6458`) dengan format pesan otomatis.
4. **Dashboard Admin**:
   - Manajemen paket rias (tambah, edit harga, ubah deskripsi/foto).
   - Pengaturan kriteria dan bobot algoritma SAW.
   - Manajemen testimoni dan portofolio.
5. **Simulasi Perhitungan SAW Interaktif**:
   - Transparansi perhitungan matriks keputusan, normalisasi (*benefit* & *cost*), dan perangkingan nilai akhir $V_i$.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend / Database**: Node.js / Express & Supabase (PostgreSQL)
- **Algoritma**: Simple Additive Weighting (SAW)

---

## 🚀 Cara Menjalankan Aplikasi di Lokal

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) di komputer Anda.

### 2. Kloning Repository
```bash
git clone https://github.com/putridevi038-creator/iyum-makeover.git
cd iyum-makeover
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Lingkungan (Environment)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan kredensial Supabase Anda jika diperlukan.

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses: `http://localhost:5173`

---

## 🏢 Profil Usaha
- **Nama Usaha**: IYUM MakeOver
- **Owner**: Mar'atus Sholikah
- **Kontak / WhatsApp**: +62 822-4981-6458
- **Instagram**: @iyum_makeover
- **Alamat Galeri**: Jl. Raya Mantup No. 12, Lamongan, Jawa Timur

---

&copy; 2025 IYUM MakeOver. All rights reserved.
