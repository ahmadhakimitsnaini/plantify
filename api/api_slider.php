<?php
/**
 * API Endpoint untuk Mengelola Data Slider (Banner)
 * * Skrip ini berfungsi sebagai REST API sederhana untuk membaca (GET) dan 
 * menyimpan (POST) data konfigurasi slider ke dalam file JSON.
 * * @author Sani (AI Engineer Student)
 * @version 1.0
 */

// =================================================================================
// 1. KONFIGURASI HEADER (CORS & CONTENT TYPE)
// =================================================================================

// Mengizinkan akses dari domain mana saja (Penting untuk frontend React/Vue/Flutter)
header("Access-Control-Allow-Origin: *");

// Menentukan metode HTTP yang diizinkan
header("Access-Control-Allow-Methods: GET, POST");

// Mengizinkan header tertentu dalam request (misal: otentikasi)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Memberitahu klien bahwa respon yang dikirim adalah format JSON
header('Content-Type: application/json');


// =================================================================================
// 2. FUNGSI BANTUAN (HELPER FUNCTIONS)
// =================================================================================

/**
 * Membaca data dari file JSON penyimpanan.
 *
 * @return array Mengembalikan array asosiatif berisi data slider.
 */
function readSliderData()
{
    // Cek isi file. Jika kosong atau file tidak ada, gunakan default object '{}'
    // json_decode param ke-2 'true' mengubahnya menjadi Array Asosiatif (bukan Object)
    return json_decode(file_get_contents('dataslider.json') ?: '{}', true);
}

/**
 * Menyimpan data kembali ke file JSON.
 *
 * @param array $data Data array yang akan disimpan.
 * @return void
 */
function writeSliderData($data)
{
    // Mengubah array PHP kembali ke format JSON
    // JSON_PRETTY_PRINT membuat file .json mudah dibaca manusia (bagus untuk debugging)
    file_put_contents('dataslider.json', json_encode($data, JSON_PRETTY_PRINT));
}


// =================================================================================
// 3. LOGIKA UTAMA (REQUEST HANDLING)
// =================================================================================

// --- Handle GET Request (Mengambil Data) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Panggil fungsi baca data
    $sliderData = readSliderData();
    
    // 2. Kirim respon JSON. Jika data kosong, kirim pesan default.
    echo json_encode($sliderData ?: ['message' => 'Data not found']);
    
    // 3. Hentikan eksekusi script agar tidak ada output tambahan
    exit;
}

// --- Handle POST Request (Menambah/Update Data) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Baca raw input dari body request (karena formatnya JSON, bukan Form Data biasa)
    $incomingData = json_decode(file_get_contents('php://input'), true);

    // 2. Validasi: Pastikan data yang masuk valid (tidak null/kosong)
    if ($incomingData) {
        $sliderData = readSliderData(); // Baca data lama yang sudah ada di file
        
        // Gabungkan data lama dengan data baru
        // Catatan: Jika ada key yang sama, data lama akan tertimpa data baru
        $sliderData = array_merge($sliderData, $incomingData); 
        
        writeSliderData($sliderData); // Simpan perubahan ke file
        
        // Kirim respon sukses
        echo json_encode(['message' => 'Data updated successfully']);
    } else {
        // Jika JSON tidak valid, kirim kode error 400 (Bad Request)
        http_response_code(400);
        echo json_encode(['message' => 'Invalid data']);
    }
}
?>