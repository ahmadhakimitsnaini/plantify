document.addEventListener('DOMContentLoaded', () => {
  // Mengambil referensi tombol reset dari DOM
  const kotakReset = document.getElementById('reset-button');

  // Pastikan elemen tombol ada sebelum memasang event listener (untuk menghindari error null)
  if (kotakReset) {
      kotakReset.addEventListener('click', async () => {
        // Opsi tambahan: Konfirmasi sebelum reset (Sangat disarankan untuk fitur destruktif)
        // if (!confirm("Apakah Anda yakin ingin mereset semua pengaturan?")) return;

        try {
          // Mengirim permintaan reset ke server
          const response = await fetch(endpoint_url + '/plantify/api/reset_settings.php', {
            method: 'POST' // Menggunakan POST karena tindakan ini mengubah state di server
          });

          // Cek apakah respon server sukses (status code 200-299)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // Jika berhasil, refresh halaman agar pengaturan kembali ke default terlihat
          console.log("Reset berhasil, memuat ulang halaman...");
          location.reload(); 

        } catch (error) {
          // Tangani jika terjadi error koneksi atau server error
          console.error('Gagal reset data:', error);
          alert('Gagal mereset pengaturan. Silakan coba lagi.'); // Beri tahu user
        }
      });
  }
});