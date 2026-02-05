const targetNode = document.getElementById('sensor1'); // Elemen yang mau dipantau

// Fungsi buat notifikasi
function triggerNotification(newValue) {
  if (Notification.permission === "granted") {
    new Notification("Alert Sensor!", {
      body: "Nilai sensor: " + newValue,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Alert Sensor!", {
          body: "Nilai sensor: " + newValue,
        });
      }
    });
  }
}

// Pantau perubahan nilai DOM
const observer = new MutationObserver(() => {
  const newValue = parseInt(targetNode.textContent, 10); // Ambil nilai elemen (convert ke integer)
  if (newValue >= 50) {
    triggerNotification(newValue); // Trigger notifikasi kalo >= 50
  }
});

// Start observer
observer.observe(targetNode, { childList: true, subtree: true });
