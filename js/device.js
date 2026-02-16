document.addEventListener('DOMContentLoaded', () => {
  // 1. Mengambil referensi elemen DOM yang dibutuhkan
  const statusElement = document.getElementById('device-status'); // Teks status (Online/Offline)
  const timestampElement = document.getElementById('timestamp'); // Data waktu yang berubah-ubah
  const dotsElement = document.getElementById('dots'); // Indikator warna (titik)
  
  // Variabel untuk menyimpan ID timer agar bisa di-reset
  let offlineTimeout;

  /**
   * 2. Fungsi untuk Mengubah Tampilan UI (Visual)
   * Mengatur warna teks dan indikator berdasarkan status koneksi.
   * @param {boolean} isOnline - true jika Online, false jika Offline
   */
  const updateStatusClasses = (isOnline) => {
    if (isOnline) {
      // Tampilan saat ONLINE: Teks hijau, Indikator hijau
      statusElement.textContent = "Online";
      statusElement.classList.add('text-green-500');
      statusElement.classList.remove('text-red-500');
      
      dotsElement.classList.add('bg-green-500');
      dotsElement.classList.remove('bg-red-500');
    } else {
      // Tampilan saat OFFLINE: Teks merah, Indikator merah
      statusElement.textContent = "Offline";
      statusElement.classList.remove('text-green-500');
      statusElement.classList.add('text-red-500');
      
      dotsElement.classList.remove('bg-green-500');
      dotsElement.classList.add('bg-red-500');
    }
  };

  /**
   * 3. Fungsi Logika "Heartbeat" (Detak Jantung)
   * Fungsi ini dipanggil setiap kali ada data baru (timestamp berubah).
   */
  const updateStatus = () => {
    // Langkah A: Set status jadi ONLINE segera setelah data diterima
    updateStatusClasses(true); 

    // Langkah B: Reset timer offline yang sedang berjalan (jika ada)
    clearTimeout(offlineTimeout);

    // Langkah C: Mulai timer baru.
    // Jika tidak ada update lagi dalam 3 detik, ubah status menjadi OFFLINE.
    offlineTimeout = setTimeout(() => {
      updateStatusClasses(false); 
    }, 3000); // Batas waktu toleransi (3000ms = 3 detik)
  };

  // 4. Memantau Perubahan pada Elemen Timestamp
  // MutationObserver digunakan untuk mendeteksi jika teks di dalam #timestamp berubah
  const observer = new MutationObserver(() => {
    if (timestampElement.textContent) {
      updateStatus(); // Panggil fungsi update setiap kali timestamp berubah
    }
  });

  // Mulai memantau elemen #timestamp
  // childList & characterData: true memastikan perubahan teks sekecil apapun terdeteksi
  if (timestampElement) {
      observer.observe(timestampElement, { childList: true, characterData: true, subtree: true });
  }

  // 5. Inisialisasi awal saat halaman dimuat
  updateStatus(); 
});