/**
 * ============================================================
 * SENSOR MONITORING SCRIPT
 * ============================================================
 * Skrip ini memantau elemen #sensor1 dan memicu notifikasi 
 * jika nilainya mencapai angka kritis (>= 50).
 */

// 1. KONFIGURASI TARGET
// Elemen DOM yang akan dipantau perubahannya (pastikan ID sesuai HTML)
const targetNode = document.getElementById('sensor1'); 

/**
 * 2. FUNGSI NOTIFIKASI
 * Menangani permintaan izin dan menampilkan notifikasi sistem.
 * @param {number} newValue - Nilai sensor terbaru yang akan ditampilkan.
 */
function triggerNotification(newValue) {
  // Cek apakah browser mendukung notifikasi
  if (!("Notification" in window)) {
    console.warn("Browser ini tidak mendukung notifikasi desktop");
    return;
  }

  // Skenario 1: Izin sudah diberikan sebelumnya
  if (Notification.permission === "granted") {
    new Notification("Alert Sensor!", {
      body: "Bahaya! Nilai sensor mencapai: " + newValue,
      icon: '/assets/warning-icon.png', // Ganti dengan path ikon proyek Anda
      tag: 'sensor-alert' // Mencegah penumpukan notifikasi (replace yang lama)
    });
  } 
  // Skenario 2: Izin belum ditentukan (default), maka minta izin
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Alert Sensor!", {
          body: "Nilai sensor: " + newValue,
        });
      }
    });
  }
}

// 3. LOGIKA PEMANTAUAN (OBSERVER)
// MutationObserver dieksekusi setiap kali ada perubahan pada targetNode
const observer = new MutationObserver((mutationsList) => {
  for(const mutation of mutationsList) {
      // Memastikan perubahan terjadi pada childList (isi teks) atau characterData
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
          
          // Mengambil teks, menghapus spasi (trim), dan konversi ke Integer
          const currentText = targetNode.textContent.trim();
          const newValue = parseInt(currentText, 10); 

          // LOGIKA BISNIS:
          // 1. !isNaN(newValue) -> Pastikan data bukan sampah/kosong
          // 2. newValue >= 50   -> Ambang batas pemicu alert
          if (!isNaN(newValue) && newValue >= 50) {
            console.log(`Threshold terlampaui: ${newValue}`);
            triggerNotification(newValue);
          }
      }
  }
});

// 4. EKSEKUSI OBSERVER
// Pastikan elemen ada sebelum menjalankan observer untuk menghindari error
if (targetNode) {
    observer.observe(targetNode, { 
        childList: true,      // Pantau penambahan/penghapusan teks di dalamnya
        subtree: true,        // Pantau juga elemen anak di dalam #sensor1 (jika ada)
        characterData: true   // Pantau perubahan nilai teks secara langsung
    });
    console.log("Monitoring sensor dimulai...");
} else {
    console.error("Gagal inisialisasi: Elemen #sensor1 tidak ditemukan di DOM.");
}