// ==========================================
// 1. KONFIGURASI GLOBAL & KONSTANTA
// ==========================================
const API_URL = 'http://192.168.100.203/hydropro/backend/load_data.php';
const FETCH_INTERVAL = 500; // Interval pengambilan data (500ms = 0.5 detik) - Sangat cepat

// Standar gaya font untuk label dan axis agar konsisten
const DEFAULT_FONT_OPTIONS = {
  color: 'gray',
  size: 13,
  family: 'Montserrat',
  weight: '600'
};

// Konfigurasi spesifik untuk masing-masing sensor (pH, TDS, Suhu, Kelembapan)
const chartConfigs = [
  { label: 'pH', yMin: 0, yMax: 14, color: '#32a4ea' },          // Biru
  { label: 'TDS', yMin: 0, yMax: 1000, color: '#6cbe77' },       // Hijau
  { label: 'Temperature', yMin: 0, yMax: 100, color: '#fb9700' },// Oranye
  { label: 'Humidity', yMin: 0, yMax: 100, color: '#fc5c91' }    // Pink
];

// ==========================================
// 2. INISIALISASI CHART
// ==========================================
// Membuat array objek Chart.js berdasarkan konfigurasi di atas
const charts = chartConfigs.map((config, index) => {
  // Mengambil elemen canvas: chart-1, chart-2, dst.
  const ctx = document.getElementById(`chart-${index + 1}`).getContext('2d');
  // Membuat instance Chart baru
  return new Chart(ctx, createChartConfig(config));
});

// Variabel untuk menyimpan data terakhir guna mencegah render ulang yang tidak perlu
let lastData = null;

// ==========================================
// 3. FUNGSI UPDATE DATA (REAL-TIME)
// ==========================================
const updateCharts = async (payload) => {
  // Cek apakah data baru sama persis dengan data lama (Debouncing sederhana)
  if (JSON.stringify(payload) === JSON.stringify(lastData)) return;
  lastData = payload; // Update cache data

  // Mengambil referensi array data & label dari setiap chart yang sudah dibuat
  const dataArrays = charts.map(chart => chart.data.datasets[0].data);
  const labelsArrays = charts.map(chart => chart.data.labels); // Mengakses array labels dari chart.data

  // Memasukkan data baru ke masing-masing chart
  // Payload diharapkan berupa objek { ph: ..., ppm: ..., suhu: ..., kelembapan: ... }
  updateChartDataAndLabels(dataArrays[0], labelsArrays[0], payload.ph);
  updateChartDataAndLabels(dataArrays[1], labelsArrays[1], payload.ppm);
  updateChartDataAndLabels(dataArrays[2], labelsArrays[2], payload.suhu);
  updateChartDataAndLabels(dataArrays[3], labelsArrays[3], payload.kelembapan);

  // Perintahkan Chart.js untuk merender ulang tampilan dengan animasi
  charts.forEach(chart => chart.update());
};

// ==========================================
// 4. FUNGSI FETCH API
// ==========================================
const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Panggil fungsi update setelah data diterima
    await updateCharts(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Jalankan fetch secara berulang sesuai interval
// Hati-hati: 500ms bisa membebani server jika user banyak
const intervalId = setInterval(fetchData, FETCH_INTERVAL);

// ==========================================
// 5. HELPER: PEMBUAT KONFIGURASI CHART
// ==========================================
function createChartConfig({ label, yMin, yMax, color }) {
  // Kita perlu mengambil context lagi di sini untuk membuat Gradient
  // (Mencari elemen berdasarkan label index di array config utama)
  const chartIndex = chartConfigs.findIndex(config => config.label === label);
  const ctx = document.getElementById(`chart-${chartIndex + 1}`).getContext('2d');

  // Membuat efek gradasi warna (dari warna solid ke transparan di bawah)
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `${color}`);    // Warna atas (pekat)
  gradient.addColorStop(1, `${color}00`);  // Warna bawah (transparan/0 opacity)

  return {
    type: 'line', // Jenis grafik: Garis
    data: {
      labels: [], // Label sumbu X (Waktu) akan diisi dinamis
      datasets: [{
        label,
        data: [], // Data sumbu Y akan diisi dinamis
        borderColor: color,
        backgroundColor: gradient, // Gunakan gradien yang dibuat
        fill: true, // Isi area di bawah garis
        tension: 0.4, // Kelengkungan garis (0 = lurus, 0.4 = mulus)
        pointRadius: 0, // Sembunyikan titik agar garis terlihat bersih
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: DEFAULT_FONT_OPTIONS.color,
            font: {
              size: DEFAULT_FONT_OPTIONS.size,
              family: DEFAULT_FONT_OPTIONS.family,
              weight: DEFAULT_FONT_OPTIONS.weight
            }
          }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        }
      },
      responsive: true,
      maintainAspectRatio: false, // Agar grafik mengikuti ukuran kontainer induk
      scales: {
        y: {
          min: yMin,
          max: yMax, // Batas atas dan bawah grafik
          ticks: {
            color: DEFAULT_FONT_OPTIONS.color,
            font: {
              size: DEFAULT_FONT_OPTIONS.size,
              family: DEFAULT_FONT_OPTIONS.family,
              weight: DEFAULT_FONT_OPTIONS.weight
            }
          },
          grid: { display: false } // Hilangkan garis grid horizontal
        },
        x: {
          ticks: {
            color: DEFAULT_FONT_OPTIONS.color,
            font: {
              size: DEFAULT_FONT_OPTIONS.size,
              family: DEFAULT_FONT_OPTIONS.family,
              weight: DEFAULT_FONT_OPTIONS.weight
            }
          },
          grid: { display: false } // Hilangkan garis grid vertikal
        }
      },
      animation: {
        duration: 0 // Matikan animasi berat saat update agar performa lancar
      }
    }
  };
}

// ==========================================
// 6. HELPER: SLIDING WINDOW DATA
// ==========================================
function updateChartDataAndLabels(dataArray, labelsArray, newValue) {
  // Batasi jumlah data yang ditampilkan hanya 30 titik terakhir
  // Konsep: FIFO (First In First Out)
  if (dataArray.length >= 30) {
    dataArray.shift();   // Hapus data terlama (depan)
    labelsArray.shift(); // Hapus label terlama (depan)
  }

  dataArray.push(newValue); // Tambah data baru (belakang)
  labelsArray.push(new Date().toLocaleTimeString('id-ID')); // Tambah waktu sekarang
}