<?php
/**
 * API Endpoint: Reset Slider Configuration
 * -----------------------------------------
 * Skrip ini berfungsi untuk mengembalikan semua pengaturan sistem (threshold)
 * ke nilai default (pabrikan). Berguna untuk fitur "Factory Reset".
 * * @method POST
 * @return JSON Status reset
 */

// Konfigurasi Header CORS & Tipe Konten
header("Access-Control-Allow-Origin: *");       // Izinkan akses dari semua domain (frontend)
header("Access-Control-Allow-Methods: POST");   // Hanya izinkan metode POST (karena mengubah data)
header("Access-Control-Allow-Headers: Content-Type");

/**
 * Fungsi untuk menyimpan data array ke file JSON.
 * @param array $data Data konfigurasi yang akan disimpan.
 */
function writeSliderData($data)
{
    // JSON_PRETTY_PRINT membuat file mudah dibaca manusia saat debugging
    file_put_contents('dataslider.json', json_encode($data, JSON_PRETTY_PRINT));
}

// ---------------------------------------------------------
// DEFINISI NILAI DEFAULT (STANDAR HIDROPONIK/TANAMAN)
// ---------------------------------------------------------
// Nilai ini disesuaikan dengan logika frontend (load_data2) sebelumnya:
// Slider 1-2: pH (Asam-Basa)
// Slider 3-4: PPM (Nutrisi)
// Slider 5-6: Persentase Perangkat (Lampu & Kipas)
$defaultValues = [
    'slider1' => 6.5,   // Batas Bawah pH (Ideal)
    'slider2' => 7.5,   // Batas Atas pH
    'slider3' => 300,   // Batas Bawah Nutrisi (PPM)
    'slider4' => 500,   // Batas Atas Nutrisi (PPM)
    'slider5' => 75,    // Intensitas Grow Light (%)
    'slider6' => 30,    // Kecepatan Kipas/Fan (%)
];

// ---------------------------------------------------------
// LOGIKA UTAMA
// ---------------------------------------------------------

// Cek apakah request yang masuk adalah POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Timpa file JSON yang ada dengan nilai default
    writeSliderData($defaultValues);
    
    // 2. Beri respon sukses ke Frontend
    echo json_encode([
        'status' => 'success',
        'message' => 'System configuration reset to default values'
    ]);
} else {
    // Jika user mencoba akses via browser (GET), tolak aksesnya.
    http_response_code(405); // Method Not Allowed
    echo json_encode(['message' => 'Method not allowed. Use POST request.']);
}
?>