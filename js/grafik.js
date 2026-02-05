const API_URL = 'http://192.168.100.203/hydropro/backend/load_data.php';
const FETCH_INTERVAL = 500;

const DEFAULT_FONT_OPTIONS = {
  color: 'gray',
  size: 13,
  family: 'Montserrat',
  weight: '600'
};

const chartConfigs = [
  { label: 'pH', yMin: 0, yMax: 14, color: '#32a4ea' },
  { label: 'TDS', yMin: 0, yMax: 1000, color: '#6cbe77' },
  { label: 'Temperature', yMin: 0, yMax: 100, color: '#fb9700' },
  { label: 'Humidity', yMin: 0, yMax: 100, color: '#fc5c91' }
];

// Membuat konteks grafik dan grafik itu sendiri
const charts = chartConfigs.map((config, index) =>
  new Chart(document.getElementById(`chart-${index + 1}`).getContext('2d'), createChartConfig(config))
);

let lastData = null;

const updateCharts = async (payload) => {
  if (JSON.stringify(payload) === JSON.stringify(lastData)) return;
  lastData = payload;

  const dataArrays = charts.map(chart => chart.data.datasets[0].data);
  const labelsArrays = charts.map(chart => chart.data.labels);

  updateChartDataAndLabels(dataArrays[0], labelsArrays[0], payload.ph);
  updateChartDataAndLabels(dataArrays[1], labelsArrays[1], payload.ppm);
  updateChartDataAndLabels(dataArrays[2], labelsArrays[2], payload.suhu);
  updateChartDataAndLabels(dataArrays[3], labelsArrays[3], payload.kelembapan);

  charts.forEach(chart => chart.update());
};

const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    await updateCharts(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

setInterval(fetchData, FETCH_INTERVAL);

function createChartConfig({ label, yMin, yMax, color }) {
  const ctx = document.getElementById(`chart-${chartConfigs.findIndex(config => config.label === label) + 1}`).getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `${color}`);
  gradient.addColorStop(1, `${color}00`); // Transparan di bawah

  return {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        backgroundColor: gradient, // Pakai gradien sebagai background
        fill: true,
        tension: 0.3
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
              weight: DEFAULT_FONT_OPTIONS.weight // Gunakan opsi bold
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: DEFAULT_FONT_OPTIONS.color,
            font: {
              size: DEFAULT_FONT_OPTIONS.size,
              family: DEFAULT_FONT_OPTIONS.family,
              weight: DEFAULT_FONT_OPTIONS.weight // Gunakan opsi bold
            }
          },
          grid: { display: false }
        },
        x: {
          ticks: {
            color: DEFAULT_FONT_OPTIONS.color,
            font: {
              size: DEFAULT_FONT_OPTIONS.size,
              family: DEFAULT_FONT_OPTIONS.family,
              weight: DEFAULT_FONT_OPTIONS.weight // Gunakan opsi bold
            }
          },
          grid: { display: false }
        }
      }
    }
  };
}

function updateChartDataAndLabels(dataArray, labelsArray, newValue) {
  if (dataArray.length >= 30) {
    dataArray.shift();
    labelsArray.shift();
  }

  dataArray.push(newValue);
  labelsArray.push(new Date().toLocaleTimeString());
}
