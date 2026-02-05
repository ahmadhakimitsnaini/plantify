const protocol = window.location.protocol.startsWith("https")
  ? "https"
  : "http";
let endpoint_url = localStorage.getItem("endpoint_url") || `${protocol}://`;

const form = document.getElementById("urlForm");
const input = document.getElementById("endpointUrl");
const output = document.getElementById("output");

// Regex untuk menangkap IP
const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;

// Mengambil IP dari URL
const ip = endpoint_url.match(ipRegex)[0];

output.textContent = `Active IP : ${ip}`;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let customUrl = input.value.trim();
  if (customUrl && !customUrl.startsWith("http")) {
    customUrl = `${protocol}://${customUrl}`;
  }
  endpoint_url = customUrl || endpoint_url;
  localStorage.setItem("endpoint_url", endpoint_url);

  // Update IP setelah URL diubah
  const newIp = endpoint_url.match(ipRegex)[0];
  output.textContent = `Active IP : ${newIp}`;
  window.location.reload();
});
