/**
 * API FETCH SCRIPT - PLANTIFY
 * ---------------------------
 * load_data1() : Ambil data sensor real-time (Berulang tiap 0.5 detik)
 * load_data2() : Ambil pengaturan batas/slider (Sekali saat web dibuka)
 */

// --- 1. AMBIL DATA SENSOR ---
async function load_data1() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_data.php`);
    if (!response.ok) throw new Error("Data sensor gagal dimuat");

    const data = await response.json();

    // Update UI Sensor & Tangki (Tampilkan "-" jika data kosong)
    document.getElementById("sensor1").textContent = data.sensor1 ?? "-";
    document.getElementById("sensor2").textContent = data.sensor2 ?? "-";
    document.getElementById("sensor3").textContent = data.sensor3 ?? "-";
    document.getElementById("sensor4").textContent = data.sensor4 ?? "-";

    document.getElementById("tank-1").textContent = (data.tank1 ?? "-") + "%";
    document.getElementById("tank-2").textContent = (data.tank2 ?? "-") + "%";
    document.getElementById("tank-3").textContent = (data.tank3 ?? "-") + "%";
    document.getElementById("tank-4").textContent = (data.tank4 ?? "-") + "%";

    // Update Status Teks & Timestamp
    document.getElementById("stat-3").textContent = data.stat_ph ?? "-";
    document.getElementById("stat-4").textContent = data.stat_ppm ?? "-";
    document.getElementById("timestamp").textContent = data.timestamp ?? "-";

    // Update Warna Indikator Pompa (Hijau = ON, Abu = OFF)
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`stat-pompa-${i}`);
      const isNyala = data[`stat_pompa_${i}`] === 1;

      if (isNyala) {
        el.classList.replace("text-gray-700", "text-green-500");
      } else {
        el.classList.replace("text-green-500", "text-gray-700");
      }
    }

  } catch (err) {
    console.error("Error load_data1:", err);
  }
}

// --- 2. AMBIL DATA PENGATURAN (SLIDER) ---
async function load_data2() {
  try {
    const response = await fetch(`${endpoint_url}/plantify/api/api_slider.php`);
    if (!response.ok) throw new Error("Data slider gagal dimuat");

    const data = await response.json();

    // Update UI Batas Min/Max
    document.getElementById("ph-min").textContent = data.slider1 ?? "-";
    document.getElementById("ph-max").textContent = data.slider2 ?? "-";
    document.getElementById("ppm-min").textContent = data.slider3 ?? "-";
    document.getElementById("ppm-max").textContent = data.slider4 ?? "-";

    // Update UI Set Point
    document.getElementById("growlight-set").textContent = (data.slider5 ?? "-") + " %";
    document.getElementById("fan-set").textContent = (data.slider6 ?? "-") + " %";

  } catch (err) {
    console.error("Error load_data2:", err);
  }
}

// --- EKSEKUSI PROGRAM ---
load_data1(); // Tarik data sensor pertama kali
load_data2(); // Tarik data pengaturan

// Jadwalkan penarikan data sensor ulang setiap 0.5 detik
setInterval(load_data1, 500);