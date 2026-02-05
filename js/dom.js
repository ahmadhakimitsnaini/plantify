document.addEventListener("DOMContentLoaded", function () {
  // Elemen untuk level air dan persentase
  var tankElements = [
    {
      waterLevel: document.getElementById("tanklevel1"),
      percentage: document.getElementById("tank-1"),
    },
    {
      waterLevel: document.getElementById("tanklevel2"),
      percentage: document.getElementById("tank-2"),
    },
    {
      waterLevel: document.getElementById("tanklevel3"),
      percentage: document.getElementById("tank-3"),
    },
    {
      waterLevel: document.getElementById("tanklevel4"),
      percentage: document.getElementById("tank-4"),
    },
  ];

  // Fungsi untuk mengupdate ikon sensor
  function updateIcons() {
    var ph = parseFloat(document.getElementById("sensor1").innerText);
    var ppm = parseFloat(document.getElementById("sensor2").innerText);
    var suhu = parseFloat(document.getElementById("sensor3").innerText);
    var kelembapan = parseFloat(document.getElementById("sensor4").innerText);

    var phMin = parseFloat(document.getElementById("ph-min").innerText);
    var phMax = parseFloat(document.getElementById("ph-max").innerText);
    var ppmMin = parseFloat(document.getElementById("ppm-min").innerText);
    var ppmMax = parseFloat(document.getElementById("ppm-max").innerText);

    updateIcon("icon-sensor1", ph, phMin, phMax);
    updateIcon("icon-sensor2", ppm, ppmMin, ppmMax);
    updateIcon("icon-sensor3", suhu, 20, 30);
    updateIcon("icon-sensor4", kelembapan, 60, 80);
  }

  // Fungsi untuk mengupdate ikon individual
  function updateIcon(iconId, value, min, max) {
    var icon = document.getElementById(iconId);
    if (value >= min && value <= max) {
      icon.classList.replace("fa-warning", "fa-check-circle");
      icon.classList.add("text-green-500");
      icon.classList.remove("text-yellow-500");
    } else {
      icon.classList.replace("fa-check-circle", "fa-warning");
      icon.classList.add("text-yellow-500");
      icon.classList.remove("text-green-500");
    }
  }

  // Fungsi untuk mengupdate warna teks pompa
  function updatePumpTextColor() {
    var pumpIds = ["pompa-up", "pompa-down", "pompa-a", "pompa-b"];
    for (var i = 0; i < pumpIds.length; i++) {
      var pumpElement = document.getElementById(pumpIds[i]);
      if (pumpElement) {
        if (pumpElement.textContent.trim() === "ON") {
          pumpElement.classList.add("bg-green-400", "text-white");
          pumpElement.classList.remove("bg-gray-100", "text-gray-400");
        } else {
          pumpElement.classList.add("bg-gray-100", "text-gray-400");
          pumpElement.classList.remove("bg-green-400", "text-white");
        }
      }
    }
  }

  // Fungsi untuk mengupdate level air berdasarkan persentase
  function updateWaterLevel(tank) {
    var percentageValue = parseFloat(tank.percentage.textContent) || 0;
    // Mengubah tinggi elemen waterLevel
    tank.waterLevel.style.height = percentageValue + "%";
    // Menentukan class bg-green-500 atau bg-red-500 berdasarkan persentase
    if (percentageValue <= 20) {
      tank.waterLevel.classList.remove("bg-green-500");
      tank.waterLevel.classList.add("bg-red-500");
    } else {
      tank.waterLevel.classList.remove("bg-red-500");
      tank.waterLevel.classList.add("bg-green-500");
    }
  }

  // Fungsi untuk mengupdate semua level air
  function updateAllWaterLevels() {
    for (var i = 0; i < tankElements.length; i++) {
      updateWaterLevel(tankElements[i]);
    }
  }

  // Buat MutationObserver untuk mendeteksi perubahan
  var observer = new MutationObserver(function () {
    // updateIcons();
    // updatePumpTextColor();
    updateAllWaterLevels();
  });

  // Konfigurasi observer
  var config = {
    childList: true,
    characterData: true,
    subtree: true,
  };

  // Target elemen yang akan diawasi
  var percentageNodes = tankElements.map(function (el) {
    return el.percentage;
  });
  var sensorNodes = [
    document.getElementById("sensor1"),
    document.getElementById("sensor2"),
    document.getElementById("sensor3"),
    document.getElementById("sensor4"),
    // document.getElementById('pompa-up'),
    // document.getElementById('pompa-down'),
    // document.getElementById('pompa-a'),
    // document.getElementById('pompa-b')
  ].filter(Boolean);

  // Mulai mengawasi setiap node target
  percentageNodes.concat(sensorNodes).forEach(function (node) {
    if (node) observer.observe(node, config);
  });
});
