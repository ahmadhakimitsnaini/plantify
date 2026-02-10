/**
 * Konstanta URL API Endpoint
 * Pastikan variabel 'endpoint_url' sudah didefinisikan sebelumnya di file konfigurasi
 * atau di bagian atas script utama.
 */
// const endpoint_url = "http://localhost/plantify"; // Contoh jika belum ada

/**
 * Fungsi: load_data1
 * -------------------
 * Bertugas mengambil data telemetri sensor (Real-time) dari server.
 * Data mencakup: Nilai sensor, level tangki, status pH/PPM, dan status pompa.
 */
async function load_data1() {
  try {
    // 1. Fetch data dari API Backend (PHP)
    const response = await fetch(endpoint_url + "/plantify/api/api_data.php");

    // Cek jika server error (misal: 404 atau 500)
    if (!response.ok) {
      throw new Error("Network error!");
    }

    // 2. Konversi respon menjadi JSON object
    const data = await response.json();
    // console.log(data); // Uncomment untuk debugging

    // 3. Update UI: Nilai Sensor & Tangki
    // Operator '??' (Nullish Coalescing) digunakan sebagai fallback.
    // Jika data.sensor1 null/undefined, maka tampilkan "-"
    document.getElementById("sensor1").textContent = data.sensor1 ?? "-";
    document.getElementById("sensor2").textContent = data.sensor2 ?? "-";
    document.getElementById("sensor3").textContent = data.sensor3 ?? "-";
    document.getElementById("sensor4").textContent = data.sensor4 ?? "-";

    // Update Level Tangki (ditambah simbol %)
    document.getElementById("tank-1").textContent = (data.tank1 ?? "-") + "%";
    document.getElementById("tank-2").textContent = (data.tank2 ?? "-") + "%";
    document.getElementById("tank-3").textContent = (data.tank3 ?? "-") + "%";
    document.getElementById("tank-4").textContent = (data.tank4 ?? "-") + "%";

    // Update Statistik Global & Timestamp
    document.getElementById("stat-3").textContent = data.stat_ph ?? "-";
    document.getElementById("stat-4").textContent = data.stat_ppm ?? "-";
    document.getElementById("timestamp").textContent = data.timestamp ?? "-";

    // 4. Update Visual Status Pompa (1 s.d 4)
    // Loop ini efisien untuk menghindari penulisan kode berulang 4 kali
    for (let i = 1; i <= 4; i++) {
      const pompaElement = document.getElementById(`stat-pompa-${i}`);

      // Jika status 1 (Nyala), ubah warna jadi Hijau
      if (data[`stat_pompa_${i}`] === 1) {
        pompaElement.classList.add("text-green-500");
        pompaElement.classList.remove("text-gray-700");
      } else {
        // Jika status 0 (Mati), ubah warna jadi Abu-abu
        pompaElement.classList.add("text-gray-700");
        pompaElement.classList.remove("text-green-500");
      }
    }
  } catch (error) {
    // Tangkap error jika fetch gagal (misal koneksi putus)
    console.error("Error loading sensor data:", error);
  }
}

/**
 * Fungsi: load_data2
 * -------------------
 * Bertugas mengambil data konfigurasi slider (Threshold/Batas).
 * Data ini biasanya tidak berubah secepat data sensor, jadi dipisahkan.
 */
async function load_data2() {
  try {
    const response = await fetch(endpoint_url + "/plantify/api/api_slider.php");

    if (!response.ok) {
      throw new Error("Network error!");
    }

    const data = await response.json();
    // console.log(data);

    // Update UI: Batas Nilai (Threshold) pH & PPM
    document.getElementById("ph-min").textContent = data.slider1 ?? "-";
    document.getElementById("ph-max").textContent = data.slider2 ?? "-";
    document.getElementById("ppm-min").textContent = data.slider3 ?? "-";
    document.getElementById("ppm-max").textContent = data.slider4 ?? "-";

    // Update UI: Persentase Set Point Cahaya & Kipas
    document.getElementById("growlight-set").textContent =
      (data.slider5 ?? "-") + " %";
    document.getElementById("fan-set").textContent =
      (data.slider6 ?? "-") + " %";
  } catch (error) {
    console.error("Error loading slider config:", error);
  }
}

// ============================================================
// EKSEKUSI UTAMA
// ============================================================

// 1. Panggil fungsi sekali saat halaman pertama dimuat
load_data1(); // Load sensor
load_data2(); // Load slider

// 2. Atur Polling (Update Otomatis)
// Menjalankan load_data1 setiap 500ms (0.5 detik) agar data sensor terlihat realtime.
// Catatan: load_data2 tidak di-looping karena data slider jarang berubah dari sisi server.
setInterval(load_data1, 500);
