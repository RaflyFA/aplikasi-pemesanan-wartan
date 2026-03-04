Markdown
# Aplikasi Pemesanan Warung Tanjakan (Wartan)
Proyek ini adalah Prototipe Frontend pemesanan makanan online untuk memenuhi tugas praktikum mata kuliah RBPL.

## Kelompok 2
1. Rafly Fahusnul Akbar (NPM: 247007111056) - Team Lead
2. Andry Junyana (NPM: 247007111033)
3. Najwa Shafa Syahidah (NPM: 247007111052)
4. Herawati (NPM: 247007111054)
5. Rispan Aprianto (NPM: 247007111059)

## Cara Menjalankan Website
1. Pengguna mengakses website resmi.
2. Pengguna memilih menu layanan yang tersedia.
3. Pengguna menekan tombol “Pesan Sekarang”.
4. Sistem menampilkan halaman formulir pemesanan.
5. Pengguna mengisi data yang diperlukan (nama lengkap, nomor telepon, dan alamat).
6. Pengguna menekan tombol “Pesan Sekarang” untuk mengirimkan pesanan.
7. Sistem melakukan validasi dan memproses pesanan.
8. Sistem menampilkan struk digital sebagai bukti transaksi.
9. Pengguna dapat mengunduh struk melalui opsi “Download Struk”.
10. Pesanan diproses dan dikirim oleh pihak penyedia layanan.
11. Pengguna menunggu hingga pesanan diterima di alamat yang telah didaftarkan.

##  Fitur Utama

* **Katalog Menu Dinamis**: Menampilkan daftar makanan dan minuman dengan status ketersediaan (Tersedia/Habis).
* **Sistem Keranjang**: Pengguna dapat menentukan jumlah porsi sebelum memasukkan ke ringkasan pesanan.
* **Kalkulasi Otomatis**: Perhitungan subtotal dan total biaya (termasuk biaya kirim) dilakukan secara real-time menggunakan JavaScript.
* **Struk Digital**: Menampilkan ringkasan data diri dan detail pesanan yang siap dikonfirmasi.
* **Responsive Design**: Tampilan yang optimal baik di perangkat mobile maupun desktop menggunakan Tailwind CSS.


## Teknologi yang Digunakan

* **HTML5**: Struktur dasar halaman web.
* **Tailwind CSS**: Framework CSS untuk desain UI yang modern dan responsive.
* **JavaScript (ES6)**: Logika pemesanan, manipulasi DOM, dan penyimpanan data sementara (localStorage).
* **Git & GitHub**: Alat kolaborasi tim dan manajemen versi kode.


## Struktur Folder

aplikasi-pemesanan-wartan/
├── docs/           # Dokumentasi (Flowchart, Gambar, Laporan PDF)
├── src/            # Kode sumber utama (HTML, CSS, JS, Assets)
│   ├── index.html  # Halaman Utama / Katalog
│   ├── pesan.html  # Halaman Form & Struk
│   └── script.js   # Logika Aplikasi
├── tests/          # File uji coba/testing
└── readme.md       # Dokumentasi proyek

## Cara Menjalankan Proyek:
Clone repositori ini:
git clone [https://github.com/RaflyFA/aplikasi-pemesanan-wartan.git](https://github.com/RaflyFA/aplikasi-pemesanan-wartan.git)

Masuk ke folder proyek:
cd aplikasi-pemesanan-wartan

Buka file src/index.html menggunakan browser atau ekstensi Live Server di VS Code.