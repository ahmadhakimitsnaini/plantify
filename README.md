# 🌱 Plantify - Smart Hydroponic System

![Plantify Banner](https://via.placeholder.com/1000x300?text=Plantify+IoT+System) 
*(Ganti link di atas dengan banner/screenshot dashboard asli )*

![Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-ESP8266-blue)
![Backend](https://img.shields.io/badge/Backend-PHP%20Native-purple)
![Frontend](https://img.shields.io/badge/Frontend-Chart.js-orange)

**Plantify** adalah sistem monitoring dan kontrol hidroponik otomatis berbasis IoT (*Internet of Things*). Sistem ini dirancang untuk menjaga kualitas air nutrisi secara *real-time* dan melakukan koreksi otomatis (pH & Nutrisi) tanpa campur tangan manusia.

---

## ✨ Fitur Utama

### 📡 Real-Time Monitoring
* **Sensor Telemetri:** Memantau Suhu air, pH, TDS (PPM), dan Level Air tangki utama.
* **Visual Dashboard:** Grafik *live update* (Chart.js) dan animasi level tangki.
* **Status Indikator:** Notifikasi visual (Hijau/Merah) jika sensor melewati batas aman.

### 🤖 Otomasi Cerdas (Automation)
* **Auto-Dosing pH:** Mengaktifkan pompa *pH Up* atau *pH Down* jika kadar keasaman tidak ideal.
* **Auto-Nutrient:** Mengaktifkan pompa nutrisi (A & B) jika kadar PPM (TDS) kurang.
* **Watchdog Timer:** Deteksi otomatis status perangkat (Online/Offline) pada dashboard.

### ⚙️ Konfigurasi Mudah
* **Threshold Slider:** Atur batas minimal/maksimal pH dan TDS langsung dari web dashboard.
* **JSON Storage:** Backend ringan berbasis file JSON (Tanpa Database MySQL yang berat).

---

## 🛠️ Arsitektur Sistem



| Komponen | Teknologi/Hardware | Deskripsi |
| :--- | :--- | :--- |
| **Mikrokontroler** | ESP8266 (NodeMCU/Wemos) | Otak pemrosesan dan konektivitas WiFi. |
| **Backend** | PHP Native | Menerima data sensor & menyimpan ke `json`. |
| **Database** | JSON File | Penyimpanan data *lightweight* (`datastream.json`). |
| **Frontend** | HTML, CSS (Tailwind), JS | Antarmuka pengguna dengan Chart.js. |
| **Aktuator** | Relay 4 Channel | Mengontrol pompa nutrisi dan pH. |

---

## 🔌 Wiring & Pinout (ESP8266)

Berikut adalah konfigurasi pin yang digunakan pada firmware:

| Pin ESP8266 | Fungsi / Perangkat | Tipe |
| :--- | :--- | :--- |
| **D1** (GPIO 5) | Pompa pH Up | Output (Relay) |
| **D3** (GPIO 0) | Pompa pH Down | Output (Relay) |
| **D4** (GPIO 2) | Pompa Nutrisi A | Output (Relay) |
| **D5** (GPIO 14) | Pompa Nutrisi B | Output (Relay) |
| **A0** (ADC) | Sensor Analog (Multiplexed) | Input |

> ⚠️ **Catatan:** Logika Relay menggunakan **Active LOW** (LOW = Nyala, HIGH = Mati).

---

## 🚀 Instalasi & Penggunaan

### 1. Persiapan Backend (Server)
1.  Pastikan Anda memiliki Web Server (XAMPP, Laragon, atau Hosting).
2.  Clone repositori ini ke folder `htdocs` atau `www`.
    ```bash
    git clone [https://github.com/ahmadhakimitsnaini/plantify.git](https://github.com/ahmadhakimitsnaini/plantify.git)
    ```
3.  Pastikan folder `api/` memiliki izin **Write/Read** agar PHP bisa membuat file `datastream.json`.

### 2. Upload Firmware (ESP8266)
1.  Buka folder `firmware/` (atau nama folder sketch arduino Anda).
2.  Buka file `.ino` menggunakan Arduino IDE.
3.  Edit kredensial WiFi dan IP Server:
    ```cpp
    const char* ssid = "NAMA_WIFI_ANDA";
    const char* password = "PASSWORD_WIFI";
    String endpoint = "http://IP_KOMPUTER_ANDA/plantify/api";
    ```
4.  Install library yang dibutuhkan via Library Manager:
    * `ArduinoJson` (v6)
    * `ESP8266WiFi`
    * `ESP8266HTTPClient`
5.  Upload ke board ESP8266.

### 3. Jalankan Dashboard
Buka browser dan akses alamat:
`http://localhost/plantify/frontend/index.html` (Sesuaikan dengan struktur folder Anda).

---

## 📸 Screenshots

| Dashboard Monitoring | Konfigurasi Slider |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard+Screenshot) | ![Config](https://via.placeholder.com/400x250?text=Config+Page) |
| *Tampilan grafik real-time* | *Pengaturan batas sensor* |

*(Jangan lupa ganti link gambar di atas dengan screenshot asli proyek Anda)*

---

## 🤝 Kontribusi

Pull Request dipersilakan! Jika Anda menemukan bug atau punya ide fitur baru, silakan buka **Issue**.

1.  Fork repositori ini.
2.  Buat branch fitur (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch (`git push origin fitur-keren`).
5.  Buka Pull Request.

---

## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<center>
Dibuat dengan ❤️ oleh <a href="https://github.com/ahmadhakimitsnaini">Ahmad Hakim Itsnaini</a>
</center>
