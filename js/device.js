document.addEventListener('DOMContentLoaded', () => {
  // Referensi elemen DOM
  const statusEl = document.getElementById('device-status');
  const timestampEl = document.getElementById('timestamp');
  const dotsEl = document.getElementById('dots');
  
  let offlineTimer; // Variabel penyimpan timer

  /**
   * Mengupdate tampilan visual (Warna & Teks)
   * @param {boolean} online - Status koneksi
   */
  const setVisualStatus = (online) => {
    if (online) {
      statusEl.textContent = "Online";
      // Ubah warna teks & indikator jadi Hijau
      statusEl.classList.replace('text-red-500', 'text-green-500');
      dotsEl.classList.replace('bg-red-500', 'bg-green-500');
    } else {
      statusEl.textContent = "Offline";
      // Ubah warna teks & indikator jadi Merah
      statusEl.classList.replace('text-green-500', 'text-red-500');
      dotsEl.classList.replace('bg-green-500', 'bg-red-500');
    }
  };

  /**
   * Logika Heartbeat / Watchdog
   * Reset timer setiap ada data baru. Jika 3 detik sepi -> Offline.
   */
  const resetWatchdog = () => {
    setVisualStatus(true); // Set Online karena ada data masuk

    clearTimeout(offlineTimer); // Hapus timer lama
    
    // Mulai timer baru (3 detik)
    offlineTimer = setTimeout(() => {
      setVisualStatus(false); // Set Offline jika waktu habis
    }, 3000);
  };

  // Observer: Memantau perubahan teks pada elemen timestamp
  const observer = new MutationObserver(() => {
    if (timestampEl.textContent) resetWatchdog();
  });

  // Mulai memantau elemen timestamp
  if (timestampEl) {
    observer.observe(timestampEl, { childList: true, characterData: true, subtree: true });
    resetWatchdog(); // Inisialisasi status awal
  }
});