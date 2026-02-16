document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. INISIALISASI & MAPPING ELEMEN
  // ==========================================
  
  // Mapping elemen visual (air) dengan elemen teks (persentase)
  const tankElements = [
    {
      waterLevel: document.getElementById("tanklevel1"),
      percentage: document.getElementById("tank-1"),
    },
    {
      waterLevel: document.getElementById("tanklevel2"),
      percentage: document.getElementById("tank-2"),
    },
    {
      waterLevel: document.getElementById("tanklevel3"),
      percentage: document.getElementById("tank-3"),
    },
    {
      waterLevel: document.getElementById("tanklevel4"),
      percentage: document.getElementById("tank-4"),
    },
  ];

  // Daftar ID Pompa untuk dipantau statusnya
  const pumpIds = ["pompa-up", "pompa-down", "pompa-a", "pompa-b"];

  // ==========================================
  // 2. FUNGSI LOGIKA SENSOR
  // ==========================================

  /**
   * Mengambil nilai sensor dan batas ambang (threshold),
   * lalu memperbarui ikon status (Aman/Bahaya).
   */
  function updateIcons() {
    // Ambil nilai aktual dari sensor
    const ph = parseFloat(document.getElementById("sensor1").innerText) || 0;
    const ppm = parseFloat(document.getElementById("sensor2").innerText) || 0;
    const suhu = parseFloat(document.getElementById("sensor3").innerText) || 0;
    const kelembapan = parseFloat(document.getElementById("sensor4").innerText) || 0;

    // Ambil batas min/max dari elemen tersembunyi/input
    const phMin = parseFloat(document.getElementById("ph-min").innerText) || 0;
    const phMax = parseFloat(document.getElementById("ph-max").innerText) || 14;
    const ppmMin = parseFloat(document.getElementById("ppm-min").innerText) || 0;
    const ppmMax = parseFloat(document.getElementById("ppm-max").innerText) || 1000;

    // Update masing-masing ikon
    updateIcon("icon-sensor1", ph, phMin, phMax);
    updateIcon("icon-sensor2", ppm, ppmMin, ppmMax);
    updateIcon("icon-sensor3", suhu, 20, 30); // Hardcoded threshold untuk suhu
    updateIcon("icon-sensor4", kelembapan, 60, 80); // Hardcoded threshold untuk kelembapan
  }

  /**
   * Helper: Mengubah ikon menjadi Centang Hijau (Aman) atau Segitiga Kuning (Warning)
   */
  function updateIcon(iconId, value, min, max) {
    const icon = document.getElementById(iconId);
    if (!icon) return; // Mencegah error jika elemen tidak ditemukan

    if (value >= min && value <= max) {
      // KONDISI AMAN
      icon.classList.replace("fa-warning", "fa-check-circle");
      icon.classList.add("text-green-500");
      icon.classList.remove("text-yellow-500");
    } else {
      // KONDISI PERINGATAN (Di luar batas wajar)
      icon.classList.replace("fa-check-circle", "fa-warning");
      icon.classList.add("text-yellow-500");
      icon.classList.remove("text-green-500");
    }
  }

  // ==========================================
  // 3. FUNGSI LOGIKA POMPA
  // ==========================================

  /**
   * Mengubah warna badge pompa berdasarkan teks "ON" atau "OFF"
   */
  function updatePumpTextColor() {
    pumpIds.forEach(id => {
      const pumpElement = document.getElementById(id);
      if (pumpElement) {
        if (pumpElement.textContent.trim() === "ON") {
          // Style Aktif (Hijau)
          pumpElement.classList.add("bg-green-400", "text-white");
          pumpElement.classList.remove("bg-gray-100", "text-gray-400");
        } else {
          // Style Non-Aktif (Abu-abu)
          pumpElement.classList.add("bg-gray-100", "text-gray-400");
          pumpElement.classList.remove("bg-green-400", "text-white");
        }
      }
    });
  }

  // ==========================================
  // 4. FUNGSI LOGIKA TANGKI AIR
  // ==========================================

  /**
   * Mengatur tinggi grafik air dan warnanya berdasarkan persentase
   */
  function updateWaterLevel(tank) {
    if (!tank.percentage || !tank.waterLevel) return;

    // Konversi teks "80%" menjadi angka 80
    const percentageValue = parseFloat(tank.percentage.textContent) || 0;

    // 1. Ubah tinggi div air (Animasi CSS akan menangani transisinya)
    tank.waterLevel.style.height = percentageValue + "%";

    // 2. Ubah warna air jadi Merah jika kritis (<= 20%)
    if (percentageValue <= 20) {
      tank.waterLevel.classList.remove("bg-green-500");
      tank.waterLevel.classList.add("bg-red-500");
    } else {
      tank.waterLevel.classList.remove("bg-red-500");
      tank.waterLevel.classList.add("bg-green-500");
    }
  }

  function updateAllWaterLevels() {
    tankElements.forEach(tank => updateWaterLevel(tank));
  }

  // ==========================================
  // 5. SETUP MUTATION OBSERVER (Reaktif)
  // ==========================================

  // Observer ini akan mendeteksi perubahan teks di HTML secara real-time
  // (Berguna jika nilai diupdate via AJAX/Fetch tanpa reload halaman)
  const observer = new MutationObserver(() => {
    // Panggil semua fungsi update UI saat data berubah
    updateIcons();
    updatePumpTextColor(); 
    updateAllWaterLevels();
  });

  const config = {
    childList: true,
    characterData: true,
    subtree: true,
  };

  // Mengumpulkan semua elemen yang perlu dipantau (Persentase Tangki & Nilai Sensor)
  const elementsToObserve = [
    ...tankElements.map(el => el.percentage), // Ambil elemen angka tangki
    document.getElementById("sensor1"),
    document.getElementById("sensor2"),
    document.getElementById("sensor3"),
    document.getElementById("sensor4"),
    // Tambahkan elemen pompa ke pemantauan agar warnanya berubah saat status berubah
    ...pumpIds.map(id => document.getElementById(id)) 
  ].filter(Boolean); // Filter untuk membuang elemen null (jika ada yg tidak ketemu)

  // Mulai memantau
  elementsToObserve.forEach(node => {
    observer.observe(node, config);
  });

  // Jalankan sekali di awal untuk inisialisasi tampilan
  updateIcons();
  updatePumpTextColor();
  updateAllWaterLevels();
});