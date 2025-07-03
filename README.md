# 📱 Nisa Phone

**Nisa Phone** adalah aplikasi backend berbasis Java yang dikembangkan menggunakan Spring Boot. Aplikasi ini dirancang untuk mengelola data terkait kontak dan informasi pengguna, serta menyediakan API RESTful yang dapat diakses oleh aplikasi frontend atau layanan lainnya.

## 🚀 Fitur Utama

* **API RESTful** untuk operasi CRUD pada entitas kontak dan pengguna.
* **Integrasi dengan MySQL** untuk penyimpanan data yang andal.
* **Penggunaan Docker** untuk memudahkan proses pengembangan dan deployment.
* **Struktur proyek modular** dengan pemisahan yang jelas antara controller, service, dan repository.

## 🛠️ Teknologi yang Digunakan

* **Java**: Bahasa pemrograman utama untuk pengembangan aplikasi.
* **Spring Boot**: Framework untuk membangun aplikasi Java dengan cepat dan efisien.
* **MySQL**: Sistem manajemen basis data relasional untuk menyimpan data aplikasi.
* **Docker**: Platform untuk membuat, mengirim, dan menjalankan aplikasi dalam kontainer.

## 📂 Struktur Proyek

```
nisa-phone/
├── src/
│   └── main/
│       └── java/
│           └── id/
│               └── com/
│                   └── anisatrilestari/
│                       ├── controller/
│                       ├── model/
│                       ├── repository/
│                       └── service/
├── pom.xml
└── README.md
```

* **controller/**: Menangani permintaan HTTP dan mengarahkan ke layanan yang sesuai.
* **model/**: Mendefinisikan struktur data dan entitas yang digunakan dalam aplikasi.
* **repository/**: Berinteraksi dengan basis data menggunakan Spring Data JPA.
* **service/**: Berisi logika bisnis utama dari aplikasi.

## ⚙️ Cara Menjalankan Aplikasi

### Prasyarat

* **Java 21** atau versi lebih baru
* **Maven** untuk manajemen dependensi
* **Docker** dan **Docker Compose** untuk menjalankan layanan dalam kontainer

### Langkah-Langkah

1. **Kloning repositori:**

   ```bash
   git clone https://github.com/cacaanisa/nisa-phone.git
   cd nisa-phone
   ```

2. **Bangun aplikasi menggunakan Maven:**

   ```bash
   mvn clean install
   ```

3. **Jalankan aplikasi menggunakan Docker Compose:**

   Pastikan Anda memiliki file `docker-compose.yml` yang dikonfigurasi dengan benar. Kemudian jalankan:

   ```bash
   docker-compose up --build
   ```

   Ini akan membangun dan menjalankan aplikasi serta layanan MySQL dalam kontainer.

4. **Akses API:**

   Setelah aplikasi berjalan, Anda dapat mengakses API melalui `http://localhost:8080`.
