/**
 * PROJECT: Plantify IoT Controller (ESP8266)
 * DESCRIPTION: Skrip ini mengontrol sistem hidroponik otomatis.
 * Tugas utamanya adalah membaca sensor (simulasi), mengontrol pompa,
 * dan melakukan sinkronisasi data (GET/POST) ke server lokal.
 */

#include <ESP8266WiFi.h>      // Library untuk konektivitas WiFi ESP8266
#include <ESP8266HTTPClient.h>// Library untuk membuat request HTTP (GET/POST)
#include <ArduinoJson.h>      // Library untuk parsing dan formatting data JSON

// ==========================================
// 1. INISIALISASI VARIABEL GLOBAL
// ==========================================

// Variabel untuk menyimpan pembacaan sensor dan level tangki
float temp, ph, tds, light, tank1, tank2, tank3, tank4;

// Variabel untuk menyimpan batas ambang (threshold) yang diambil dari server
float ph_min, ph_max, tds_min, tds_max;

// Status Pompa (1 = ON, 0 = OFF)
// D1: pH Up, D3: pH Down, D4: Nutrisi A, D5: Nutrisi B
int pompa_up, pompa_down, pompa_a, pompa_b;

// Status tekstual untuk dikirim ke dashboard (misal: "Normal", "Bahaya")
String stat_ph, stat_ppm;

// ==========================================
// 2. KONFIGURASI KONEKSI
// ==========================================

// Alamat API Server (Backend PHP)
String endpoint = "http://192.168.1.25/plantify/api";  

// Kredensial WiFi
const char* ssid = "P";         
const char* password = "123456789";  

// ==========================================
// 3. FUNGSI SETUP (Dijalankan Sekali)
// ==========================================
void setup() {
  Serial.begin(115200); // Memulai komunikasi serial untuk debugging

  // Konfigurasi Pin GPIO untuk Relay/Pompa sebagai OUTPUT
  pinMode(D1, OUTPUT);  // Pompa pH Up
  pinMode(D3, OUTPUT);  // Pompa pH Down
  pinMode(D4, OUTPUT);  // Pompa Nutrisi A
  pinMode(D5, OUTPUT);  // Pompa Nutrisi B

  // Memulai proses koneksi ke jaringan WiFi
  Serial.println("Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);

  // Loop blocking: Menunggu hingga status terkoneksi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Jika berhasil terhubung
  Serial.println("");
  Serial.println("WiFi terhubung!");
  Serial.print("Alamat IP ESP8266: ");
  Serial.println(WiFi.localIP());
}

// ==========================================
// 4. FUNGSI LOOP (Dijalankan Terus-menerus)
// ==========================================
void loop() {
  // 1. Simulasi atau pembacaan nilai sensor
  sensor_random(); 
  
  // 2. Logika kontrol otomatis (menyalakan/mematikan pompa berdasarkan nilai sensor)
  logic(); 
  
  // 3. Mengambil pengaturan threshold (ph_min, ph_max, dll) dari database
  get_data(); 
  
  // 4. Mengirim data sensor terbaru ke database
  post_data(); 
  
  // 5. Menampilkan data ke Serial Monitor untuk debugging
  print(); 
  
  // Jeda 500ms sebelum pengulangan berikutnya
  delay(500); 
}

// CATATAN: Definisi fungsi sensor_random(), logic(), get_data(), post_data(), dan print()
// harus ada di bawah ini atau di file terpisah agar kode bisa dikompilasi.