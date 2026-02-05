document.addEventListener('DOMContentLoaded', () => {
  const statusElement = document.getElementById('device-status');
  const timestampElement = document.getElementById('timestamp');
  const dotsElement = document.getElementById('dots'); // Elemen untuk dots
  let offlineTimeout;

  const updateStatusClasses = (isOnline) => {
    if (isOnline) {
      statusElement.textContent = "Online";
      statusElement.classList.add('text-green-500');
      statusElement.classList.remove('text-red-500');
      dotsElement.classList.add('bg-green-500');
      dotsElement.classList.remove('bg-red-500');
    } else {
      statusElement.textContent = "Offline";
      statusElement.classList.remove('text-green-500');
      statusElement.classList.add('text-red-500');
      dotsElement.classList.remove('bg-green-500');
      dotsElement.classList.add('bg-red-500');
    }
  };

  const updateStatus = () => {
    updateStatusClasses(true); // Set status ke Online

    clearTimeout(offlineTimeout);
    offlineTimeout = setTimeout(() => {
      updateStatusClasses(false); // Set status ke Offline setelah 3 detik
    }, 3000);
  };

  const observer = new MutationObserver(() => {
    if (timestampElement.textContent) {
      updateStatus(); // Update status jika timestamp berubah
    }
  });

  observer.observe(timestampElement, { childList: true, characterData: true, subtree: true });

  updateStatus(); // Cek status awal
});