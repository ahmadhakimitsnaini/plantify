document.addEventListener('DOMContentLoaded', () => {
  const kotakReset = document.getElementById('reset-button');

  kotakReset.addEventListener('click', async () => {
    try {
      const response = await fetch(endpoint_url + '/plantify/api/reset_settings.php', {
        method: 'POST' // Mengubah metode menjadi POST
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      location.reload(); // Refresh laman setelah berhasil reset

    } catch (error) {
      console.error('Gagal reset data:', error);
    }
  });
});