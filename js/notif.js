// Mengambil referensi elemen DOM yang akan dipantau perubahannya
const targetNode = document.getElementById('sensor1'); 

// Fungsi untuk membuat dan menampilkan notifikasi browser
function triggerNotification(newValue) {
  // Cek apakah izin notifikasi sudah diberikan sebelumnya
  if (Notification.permission === "granted") {
    new Notification("Alert Sensor!", {
      body: "Nilai sensor: " + newValue,
      icon: '/path/to/icon.png' // Opsional: Tambahkan ikon agar lebih menarik
    });
  } 
  // Jika belum ditolak (default), minta izin kepada user
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      // Jika user memberikan izin, langsung tampilkan notifikasi
      if (permission === "granted") {
        new Notification("Alert Sensor!", {
          body: "Nilai sensor: " + newValue,
        });
      }
    });
  }
}

// Inisialisasi MutationObserver untuk memantau perubahan pada DOM
const observer = new MutationObserver((mutationsList) => {
  // Loop mutation record (meskipun biasanya hanya 1 perubahan teks)
  for(const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Ambil teks konten terbaru, bersihkan spasi, dan ubah ke integer
          const currentText = targetNode.textContent.trim();
          const newValue = parseInt(currentText, 10); 

          // Validasi: Pastikan nilainya adalah angka (bukan NaN) sebelum dicek
          if (!isNaN(newValue) && newValue >= 50) {
            triggerNotification(newValue); // Panggil fungsi notifikasi
          }
      }
  }
});

// Mulai memantau elemen target
// childList: true -> memantau penambahan/penghapusan node anak (teks adalah node anak)
// subtree: true -> memantau perubahan di seluruh turunan elemen (opsional jika elemennya sederhana)
// characterData: true -> (opsional) memantau perubahan nilai teks node secara langsung
if (targetNode) {
    observer.observe(targetNode, { 
        childList: true, 
        subtree: true,
        characterData: true 
    });
} else {
    console.error("Elemen #sensor1 tidak ditemukan!");
}