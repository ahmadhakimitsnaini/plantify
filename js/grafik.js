// ==========================================
// 1. KONFIGURASI & KONSTANTA
// ==========================================
const API_URL = 'http://192.168.100.203/hydropro/backend/load_data.php';
const FETCH_INTERVAL = 500; // 0.5 Detik

// Konfigurasi visual sensor (Warna & Batas Y-Axis)
const chartConfigs = [
  { key: 'ph',         label: 'pH',           min: 0, max: 14,   color: '#32a4ea' },
  { key: 'ppm',        label: 'TDS',          min: 0, max: 1000, color: '#6cbe77' },
  { key: 'suhu',       label: 'Temperature',  min: 0, max: 100,  color: '#fb9700' },
  { key: 'kelembapan', label: 'Humidity',     min: 0, max: 100,  color: '#fc5c91' }
];

const fontStyle = { color: 'gray', size: 13, family: 'Montserrat', weight: '600' };

// ==========================================
// 2. INISIALISASI CHART.JS
// ==========================================
const charts = chartConfigs.map((config, index) => {
  const ctx = document.getElementById(`chart-${index + 1}`).getContext('2d');
  return new Chart(ctx, generateChartOptions(ctx, config));
});

let lastPayload = null; // Cache untuk mencegah render berulang

// ==========================================
// 3. LOGIKA UPDATE DATA
// ==========================================

// Fungsi Fetch Data Utama
const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

// Fungsi Update Tampilan Grafik
const updateDashboard = (data) => {
  // 1. Cek apakah data berubah (Debouncing)
  if (JSON.stringify(data) === JSON.stringify(lastPayload)) return;
  lastPayload = data;

  // 2. Loop setiap chart untuk update datanya
  charts.forEach((chart, index) => {
    const key = chartConfigs[index].key; // 'ph', 'ppm', dst
    const value = data[key];
    
    updateChartData(chart, value);
  });
};

// Helper: Manajemen Sliding Window Data (Max 30 Poin)
function updateChartData(chart, value) {
  const dataset = chart.data.datasets[0].data;
  const labels = chart.data.labels;

  if (dataset.length >= 30) {
    dataset.shift(); // Hapus data terlama
    labels.shift();
  }

  dataset.push(value); // Tambah data baru
  labels.push(new Date().toLocaleTimeString('id-ID'));
  
  chart.update(); // Render ulang
}

// ==========================================
// 4. HELPER: VISUALISASI CHART
// ==========================================
function generateChartOptions(ctx, { label, min, max, color }) {
  // Buat gradien warna (Pudar ke bawah)
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, `${color}00`);

  return {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,     // Garis melengkung halus
        pointRadius: 0,   // Sembunyikan titik
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 }, // Matikan animasi berat agar performa lancar
      plugins: {
        legend: { labels: { color: fontStyle.color, font: fontStyle } }
      },
      scales: {
        y: {
          min, max,
          ticks: { color: fontStyle.color, font: fontStyle },
          grid: { display: false }
        },
        x: {
          ticks: { color: fontStyle.color, font: fontStyle },
          grid: { display: false }
        }
      }
    }
  };
}

// Mulai Loop Data
setInterval(fetchData, FETCH_INTERVAL);