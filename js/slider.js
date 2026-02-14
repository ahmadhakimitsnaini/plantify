document.addEventListener("DOMContentLoaded", function () {
  // Daftar ID untuk elemen input slider (range)
  const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6'];
  
  // Mapping antara ID slider dengan ID elemen teks yang menampilkan angkanya
  const displayElements = {
    slider1: 'slider-1',
    slider2: 'slider-2',
    slider3: 'slider-3',
    slider4: 'slider-4',
    slider5: 'slider-5',
    slider6: 'slider-6',
  };

  /**
   * Memperbarui tampilan angka di UI secara sinkron
   * Mengambil nilai dari input range dan menaruhnya di elemen teks terkait
   */
  const updateSliderDisplay = () => {
    sliders.forEach(id => {
      const slider = document.getElementById(id);
      const displayId = displayElements[id];
      if (slider && document.getElementById(displayId)) {
          document.getElementById(displayId).textContent = slider.value;
      }
    });
  };

  // Objek untuk menyimpan state timer debounce setiap slider secara independen
  let debounceTimers = {};

  /**
   * Fungsi Debounce
   * Mencegah pemanggilan fungsi berulang-ulang dalam waktu singkat.
   * Sangat penting untuk mengurangi beban request ke server saat slider digeser.
   */
  const debounce = (func, id, delay) => {
    clearTimeout(debounceTimers[id]); // Hapus timer sebelumnya jika ada
    debounceTimers[id] = setTimeout(func, delay); // Set timer baru
  };

  /**
   * Mengambil data awal (GET) dari server
   * Digunakan untuk sinkronisasi posisi slider saat halaman pertama kali dimuat
   */
  const getSliders = async () => {
    try {
      // Pastikan variabel endpoint_url sudah didefinisikan secara global sebelumnya
      const response = await fetch(endpoint_url + '/plantify/api/api_slider.php');
      const data = await response.json();

      sliders.forEach(id => {
        // Cek apakah data untuk slider tersebut ada di response
        if (data[id] !== undefined) {
          const element = document.getElementById(id);
          if (element) element.value = data[id];
        }
      });

      // Update angka di UI setelah nilai dari database masuk
      updateSliderDisplay();
    } catch (error) {
      console.error("Gagal memuat nilai slider:", error);
    }
  };

  /**
   * Mengirim perubahan nilai (POST) ke server
   * @param {string} id - ID dari slider
   * @param {string|number} value - Nilai slider
   */
  const saveSliderValue = async (id, value) => {
    const sliderData = { [id]: value }; // Membungkus data dalam objek dinamis
    try {
      const response = await fetch(endpoint_url + '/plantify/api/api_slider.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliderData),
      });
      const responseData = await response.json();
      console.log(`Slider ${id} berhasil diupdate ke ${value}. Respon Server:`, responseData);
    } catch (error) {
      console.error(`Gagal mengirim nilai slider ${id}:`, error);
    }
  };

  // Inisialisasi Event Listener untuk setiap slider
  sliders.forEach(id => {
    const slider = document.getElementById(id);

    if (slider) {
        slider.addEventListener('input', () => {
          // 1. Update UI secara instan agar responsif di mata user
          updateSliderDisplay();
          
          // 2. Simpan ke database dengan delay (debounce)
          // Mencegah request dikirim setiap pixel pergeseran, menunggu user berhenti 500ms
          debounce(() => saveSliderValue(id, slider.value), id, 500); 
        });
    }
  });

  // Panggil fungsi getSliders saat inisialisasi script selesai
  getSliders();
});