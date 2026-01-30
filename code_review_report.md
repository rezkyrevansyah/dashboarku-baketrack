# Laporan Code Review BakeTrack Dashboard

Berikut adalah hasil review kode berdasarkan checklist yang telah disepakati.

## 1. Keterbacaan (Readability)

- **[x] Penamaan Deskriptif:** Secara umum penamaan variabel dan fungsi sudah cukup deskriptif (contoh: `transactions`, `productOptions`, `submitTransaction`).
  - _Catatan:_ Pada `src/app/input/page.tsx`, variabel `msgToDelete` bisa diganti menjadi `transactionToDelete` agar lebih eksplisit bahwa objek tersebut adalah transaksi, bukan sekadar pesan.
- **[x] Self-Explanatory:** Alur logika mudah diikuti, terutama penggunaan custom hook `useTable` yang sangat membantu menyederhanakan komponen.
- **[x] Konsistensi:** Style naming convention (camelCase untuk variabel, PascalCase untuk komponen) diterapkan secara konsisten.
  - _Saran:_ Format mata uang (currency) masih ditulis manual di beberapa tempat. Sebaiknya dibuat utility function terpusat.

## 2. Desain & Arsitektur (Clean Code & SOLID)

- **[!] Single Responsibility (SRP):**
  - `src/services/api.ts` sudah baik, fokus hanya pada komunikasi API.
  - `src/app/input/page.tsx` (482 baris) dan `src/app/report/page.tsx` (433 baris) terlalu besar. Kedua file ini mencampur aduk logika UI, manajemen state form, logika bisnis (kalkulasi report), dan data fetching.
  - _Rekomendasi:_ Pecah komponen besar menjadi komponen kecil. Contoh: pisahkan form input menjadi `TransactionForm.tsx` dan tabel riwayat menjadi `TransactionTable.tsx`. Pindahkan logika kalkulasi report ke hook terpisah misal `useReportStats`.
- **[!] Ukuran File & Fungsi:**
  - `src/app/input/page.tsx`: **482 baris** (Melebihi batas 200 baris).
  - `src/app/report/page.tsx`: **433 baris** (Melebihi batas 200 baris).
  - `src/services/api.ts`: 183 baris (Aman).
  - Fungsi `InputPage` dan `ReportPage` terlalu panjang karena logic dan JSX menyatu.
- **[x] DRY (Don't Repeat Yourself):**
  - Kode format tanggal dan mata uang (`toLocaleString('id-ID')`) muncul berulang kali di `input/page.tsx` dan `report/page.tsx`.
  - _Rekomendasi:_ Buat file `src/utils/format.ts` untuk fungsi `formatCurrency(value)` dan `formatDate(date)`.
- **[x] KISS:** Penggunaan library `recharts` dan `lucide-react` sudah tepat guna dan tidak over-engineered. Penggunaan `native` fetch di `api.ts` juga bagus tanpa perlu library tambahan seperti axios jika tidak diperlukan.

## 3. Logika & Performa

- **[x] Optimasi Loop:** Logic pada `report/page.tsx` melakukan iterasi `transactions` beberapa kali (untuk `stats`, `topProducts`, `weeklyData`). Untuk jumlah data ribuan masih aman, namun jika data bertambah besar, pertimbangkan untuk menggabungkan kalkulasi dalam satu kali loop (reduce) atau memindahkannya ke backend.
- **[x] Error Handling:**
  - `api.ts` menggunakan `try-catch` dengan baik dan mengembalikan nilai fallback yang aman.
  - `input/page.tsx` masih menggunakan `alert()` browser untuk notifikasi error.
  - _Saran:_ Gunakan komponen UI Toast/Notification agar lebih UX friendly daripada `alert()`.
- **[x] Edge Cases:**
  - Penanganan data kosong pada `profile` dan `transactions` sudah ada (fallback ke array kosong atau nilai default).
  - Input validasi HTML5 (`required`, `min="1"`) sudah digunakan.

## 4. Keamanan & Kebersihan (Security & Hygiene)

- **[!] No Hardcoded Secrets:**
  - **CRITICAL:** Ditemukan URL Google Script yang di-hardcode di `src/services/api.ts`:
    ```typescript
    export const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzNmRQ1QxzYqsKprHPGDGJg47aCABDJ2wr1JLpnzNZR0ZOPRDZNhb6dlqqW3ElyBAJy/exec";
    ```
  - _Tindakan:_ Pindahkan URL ini segera ke `.env` variable (misal `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`).
- **[x] Sanitasi Input:** Penggunaan `encodeURIComponent` pada parameter URL di `api.ts` sudah tepat untuk mencegah URL injection sederhana.
- **[x] Cleanup:** Tidak ditemukan console.log debugging yang tertinggal secara signifikan (kecuali `console.error` yang memang diperlukan).

## Kesimpulan & Langkah Selanjutnya

Secara keseluruhan kode sudah berjalan dengan baik, namun perlu refactoring untuk maintainability jangka panjang.

1.  **Prioritas Tinggi:** Pindahkan `GOOGLE_SCRIPT_URL` ke `.env`.
2.  **Prioritas Menengah:** Refactor `input/page.tsx` dan `report/page.tsx` untuk memecah komponen dan mengurangi jumlah baris kode (target < 200 baris).
3.  **Prioritas Rendah:** Buat utility function untuk format currency dan date agar DRY.
