<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Mengatur timezone ke indonesia (Jakarta)
date_default_timezone_set('Asia/Jakarta');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true); // Decode JSON

  // Menambahkan waktu dan tanggal dengan WIB
  $data['timestamp'] = date('d M Y - H:i:s'); // Format: DD Month YYYY - HH:MM:SS WIB

  // Simpan data yang sudah ditambah timestamp ke file JSON
  file_put_contents('datastream.json', json_encode($data));

  // Mengirim respons
  echo json_encode('Data berhasil diterima!'); // Kembalikan pesan dan data
} else if (file_exists('datastream.json')) {
  echo file_get_contents('datastream.json');
}
