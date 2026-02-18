<?php
// ==========================================
// 1. KONFIGURASI HEADER & CORS
// ==========================================
// Mengizinkan akses dari domain mana saja (Penting untuk IoT/Frontend beda server)
header("Access-Control-Allow-Origin: *");
// Mengizinkan metode HTTP yang dipakai
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Mengizinkan header tertentu
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Memberitahu browser bahwa respon yang dikirim adalah format JSON
header('Content-Type: application/json');

// ==========================================
// 2. KONFIGURASI ZONA WAKTU
// ==========================================
// Penting agar timestamp yang dihasilkan sesuai waktu lokal (WIB)
date_default_timezone_set('Asia/Jakarta');

// ==========================================
// 3. LOGIKA PENANGANAN REQUEST (POST)
// ==========================================
// Bagian ini dijalankan saat ESP8266/IoT mengirim data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  
  // Mengambil raw data dari body request dan mengubahnya jadi Array PHP
  // file_get_contents('php://input') membaca body raw dari HTTP POST
  $data = json_decode(file_get_contents('php://input'), true); 

  // Validasi sederhana: Pastikan data tidak kosong
  if ($data) {
      // Menambahkan data waktu server saat ini
      // Format: 18 Feb 2026 - 23:30:00
      $data['timestamp'] = date('d M Y - H:i:s'); 

      // Menyimpan kembali data (sekarang + timestamp) ke file 'datastream.json'
      // Ini bertindak sebagai database sementara yang sangat sederhana
      file_put_contents('datastream.json', json_encode($data, JSON_PRETTY_PRINT));

      // Memberikan respon sukses ke pengirim (IoT)
      echo json_encode([
          "status" => "success",
          "message" => "Data berhasil diterima dan disimpan",
          "timestamp" => $data['timestamp']
      ]);
  } else {
      // Respon jika data yang dikirim kosong/rusak
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "Data JSON tidak valid"]);
  }
} 

// ==========================================
// 4. LOGIKA PENANGANAN REQUEST (GET)
// ==========================================
// Bagian ini dijalankan saat Website/Frontend meminta data
else if (file_exists('datastream.json')) {
  // Membaca file JSON dan langsung menampilkannya ke browser
  echo file_get_contents('datastream.json');
} else {
  // Jika file belum ada (belum pernah ada data masuk)
  echo json_encode(["status" => "empty", "message" => "Belum ada data tersimpan"]);
}
?>