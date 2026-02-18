// Pastikan variabel 'endpoint_url' sudah didefinisikan secara global

/**
 * Mengambil data sensor real-time (Suhu, pH, TDS, Level Air)
 * Endpoint: /api/api_data.php
 */
async function load_data1() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_data.php`);
    if (!response.ok) throw new Error("Gagal mengambil data sensor");

    const data = await response.json();

    // 1. Update Nilai Sensor (Gunakan '-' jika data null)
    document.getElementById("sensor1").textContent = data.sensor1 ?? "-";
    document.getElementById("sensor2").textContent = data.sensor2 ?? "-";
    document.getElementById("sensor3").textContent = data.sensor3 ?? "-";
    document.getElementById("sensor4").textContent = data.sensor4 ?? "-";

    // 2. Update Persentase Tangki
    document.getElementById("tank-1").textContent = (data.tank1 ?? "-") + "%";
    document.getElementById("tank-2").textContent = (data.tank2 ?? "-") + "%";
    document.getElementById("tank-3").textContent = (data.tank3 ?? "-") + "%";
    document.getElementById("tank-4").textContent = (data.tank4 ?? "-") + "%";

    // 3. Update Statistik & Timestamp
    document.getElementById("stat-3").textContent = data.stat_ph ?? "-";
    document.getElementById("stat-4").textContent = data.stat_ppm ?? "-";
    document.getElementById("timestamp").textContent = data.timestamp ?? "-";

    // 4. Update Warna Indikator Pompa (Hijau = ON, Abu-abu = OFF)
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`stat-pompa-${i}`);
      const isOn = data[`stat_pompa_${i}`] === 1;

      if (isOn) {
        el.classList.add("text-green-500");
        el.classList.remove("text-gray-700");
      } else {
        el.classList.add("text-gray-700");
        el.classList.remove("text-green-500");
      }
    }

  } catch (error) {
    console.error("Error load_data1:", error);
  }
}

/**
 * Mengambil konfigurasi threshold/slider (Batas pH, PPM, dll)
 * Endpoint: /api/api_slider.php
 */
async function load_data2() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_slider.php`);
    if (!response.ok) throw new Error("Gagal mengambil data slider");

    const data = await response.json();

    // Update UI Threshold (Batas Bawah & Atas)
    document.getElementById("ph-min").textContent = data.slider1 ?? "-";
    document.getElementById("ph-max").textContent = data.slider2 ?? "-";
    document.getElementById("ppm-min").textContent = data.slider3 ?? "-";
    document.getElementById("ppm-max").textContent = data.slider4 ?? "-";

    // Update Set Point Cahaya & Kipas
    document.getElementById("growlight-set").textContent = (data.slider5 ?? "-") + " %";
    document.getElementById("fan-set").textContent = (data.slider6 ?? "-") + " %";

  } catch (error) {
    console.error("Error load_data2:", error);
  }
}

// --- EKSEKUSI UTAMA ---

// Load data pertama kali saat halaman dibuka
load_data1(); 
load_data2();

// Refresh data sensor setiap 500ms (Real-time)
setInterval(load_data1, 500);