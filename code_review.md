# 🛡️ Code Review Checklist

## 1. Keterbacaan (Readability)

- [ ] **Penamaan Deskriptif:** Nama variabel, fungsi, dan class menjelaskan tujuannya (bukan `a`, `data`, `process`).
- [ ] **Self-Explanatory:** Logika kode mudah diikuti tanpa harus bergantung pada komentar.
- [ ] **Konsistensi:** Penulisan (naming convention, indentasi) konsisten di seluruh file.

## 2. Desain & Arsitektur (Clean Code & SOLID)

- [ ] **Single Responsibility (SRP):** Satu fungsi atau class hanya mengerjakan satu hal.
- [ ] **Ukuran File & Fungsi:** - [ ] Maksimal **200 baris** per file/class (agar tetap maintainable).
  - [ ] Fungsi diusahakan ramping (idealnya < 20-30 baris).
- [ ] **DRY (Don't Repeat Yourself):** Tidak ada logika yang diulang-ulang.
- [ ] **KISS (Keep It Simple):** Tidak menggunakan teknik yang terlalu kompleks jika ada cara yang lebih sederhana.

## 3. Logika & Performa

- [ ] **Optimasi Loop:** Tidak ada nested loops yang tidak perlu (cek kompleksitas waktu).
- [ ] **Error Handling:** Menggunakan `try-catch` atau pengecekan kondisi yang tepat sebelum eksekusi.
- [ ] **Edge Cases:** Menangani input `null`, `undefined`, string kosong, atau tipe data yang tidak sesuai.

## 4. Keamanan & Kebersihan (Security & Hygiene)

- [ ] **No Hardcoded Secrets:** Tidak ada API Key, password, atau URL database di dalam kode (gunakan `.env`).
- [ ] **Sanitasi Input:** Melakukan validasi pada data yang datang dari user/external API.
- [ ] **Cleanup:** Tidak ada variabel, fungsi, atau import yang menganggur (unused code).
- [ ] **Comments:** Komentar hanya digunakan untuk menjelaskan "MENGAPA" (alasan bisnis), bukan "APA" (karena kodenya harus sudah jelas).
