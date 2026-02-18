/**
 * SKRIP MONITORING PLANTIFY
 * -------------------------
 * Mengambil data dari API Backend dan menampilkannya ke Dashboard.
 * 1. load_data1(): Data Sensor Real-time (Looping 0.5 detik).
 * 2. load_data2(): Data Setting/Slider (Hanya sekali saat load).
 */

// Pastikan 'endpoint_url' sudah di-set di file config sebelumnya

// --- 1. FUNGSI DATA SENSOR (REAL-TIME) ---
async function load_data1() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_data.php`);
    if (!response.ok) throw new Error("Gagal ambil data sensor");

    const data = await response.json();

    // A. Update Angka Sensor & Level Air (Gunakan '-' jika kosong)
    document.getElementById("sensor1").textContent = data.sensor1 ?? "-";
    document.getElementById("sensor2").textContent = data.sensor2 ?? "-";
    document.getElementById("sensor3").textContent = data.sensor3 ?? "-";
    document.getElementById("sensor4").textContent = data.sensor4 ?? "-";

    document.getElementById("tank-1").textContent = (data.tank1 ?? "-") + "%";
    document.getElementById("tank-2").textContent = (data.tank2 ?? "-") + "%";
    document.getElementById("tank-3").textContent = (data.tank3 ?? "-") + "%";
    document.getElementById("tank-4").textContent = (data.tank4 ?? "-") + "%";

    // B. Update Status Teks & Waktu
    document.getElementById("stat-3").textContent = data.stat_ph ?? "-";
    document.getElementById("stat-4").textContent = data.stat_ppm ?? "-";
    document.getElementById("timestamp").textContent = data.timestamp ?? "-";

    // C. Update Warna Status Pompa (Looping ID 1-4)
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`stat-pompa-${i}`);
      const isNyala = data[`stat_pompa_${i}`] === 1; // 1 = ON

      // Jika Nyala: Hijau, Jika Mati: Abu-abu
      if (isNyala) {
        el.classList.add("text-green-500");
        el.classList.remove("text-gray-700");
      } else {
        el.classList.add("text-gray-700");
        el.classList.remove("text-green-500");
      }
    }

  } catch (err) {
    console.error("Error load_data1:", err);
  }
}

// --- 2. FUNGSI DATA CONFIG (THRESHOLDS) ---
async function load_data2() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_slider.php`);
    if (!response.ok) throw new Error("Gagal ambil data slider");

    const data = await response.json();

    // Update Batas Min/Max pH & PPM
    document.getElementById("ph-min").textContent = data.slider1 ?? "-";
    document.getElementById("ph-max").textContent = data.slider2 ?? "-";
    document.getElementById("ppm-min").textContent = data.slider3 ?? "-";
    document.getElementById("ppm-max").textContent = data.slider4 ?? "-";

    // Update Set Point Alat Lain
    document.getElementById("growlight-set").textContent = (data.slider5 ?? "-") + " %";
    document.getElementById("fan-set").textContent = (data.slider6 ?? "-") + " %";

  } catch (err) {
    console.error("Error load_data2:", err);
  }
}

// --- EKSEKUSI ---
load_data1(); // Jalan sekali di awal
load_data2(); // Jalan sekali di awal
setInterval(load_data1, 500); // Ulangi load_data1 setiap 0.5 detik