// ==========================================
// MONITORING SENSOR & NOTIFIKASI
// ==========================================

const targetNode = document.getElementById('sensor1');
const THRESHOLD = 50; // Batas aman

/**
 * Menampilkan notifikasi browser jika izin diberikan.
 */
function showNotification(value) {
  // Cek dukungan browser
  if (!("Notification" in window)) return;

  // Logika Izin: Jika belum ada, minta izin. Jika sudah, langsung tampilkan.
  if (Notification.permission === "granted") {
    new Notification("Peringatan Sensor!", {
      body: `Bahaya! Nilai sensor mencapai ${value}`,
      icon: '/assets/warning.png', // Opsional
      tag: 'sensor-alert' // Mencegah spam notifikasi (menumpuk)
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") showNotification(value);
    });
  }
}

// 1. Inisialisasi Observer
const observer = new MutationObserver(() => {
  // Ambil teks terbaru, bersihkan spasi, ubah ke angka
  const currentValue = parseInt(targetNode.textContent.trim(), 10);

  // 2. Logika Pemicu Notifikasi
  // Validasi: Harus angka (bukan NaN) dan melebihi batas
  if (!isNaN(currentValue) && currentValue >= THRESHOLD) {
    console.log(`Alert triggered: ${currentValue}`);
    showNotification(currentValue);
  }
});

// 3. Mulai Memantau
if (targetNode) {
  // Pantau perubahan isi teks (characterData) & elemen anak (childList)
  observer.observe(targetNode, { 
    childList: true, 
    characterData: true, 
    subtree: true 
  });
  console.log("Monitoring sensor aktif...");
} else {
  console.error("Elemen #sensor1 tidak ditemukan!");
}