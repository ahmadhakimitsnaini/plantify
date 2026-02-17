// ==========================================
// 1. KONFIGURASI PROTOKOL & URL AWAL
// ==========================================

// Mendeteksi protokol saat ini (http atau https) agar sesuai dengan environment
const protocol = window.location.protocol.startsWith("https") ? "https" : "http";

// Mengambil URL endpoint yang tersimpan di LocalStorage browser
// Jika tidak ada (kosong), set default ke protokol saja (misal: "http://")
let endpoint_url = localStorage.getItem("endpoint_url") || `${protocol}://`;

// ==========================================
// 2. REFERENSI ELEMEN DOM
// ==========================================
const form = document.getElementById("urlForm");     // Form input
const input = document.getElementById("endpointUrl"); // Input field
const output = document.getElementById("output");    // Teks untuk menampilkan IP aktif

// ==========================================
// 3. LOGIKA EKSTRAKSI IP ADDRESS (REGEX)
// ==========================================

// Pola Regex untuk mendeteksi IPv4 (Format: angka.angka.angka.angka)
// \d{1,3} = 1 sampai 3 digit angka
const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;

// Mencoba mengambil IP dari string endpoint_url
const ipMatch = endpoint_url.match(ipRegex);

// Validasi: Jika IP ditemukan ambil index ke-0, jika tidak tampilkan status default
// (Penting: Mencegah error "Cannot read property '0' of null" jika URL adalah domain)
const ip = ipMatch ? ipMatch[0] : "Belum diset / Domain";

// Tampilkan IP ke layar
if (output) {
    output.textContent = `Active IP : ${ip}`;
}

// ==========================================
// 4. EVENT LISTENER (FORM SUBMIT)
// ==========================================
if (form) {
    form.addEventListener("submit", (event) => {
        // Mencegah halaman refresh otomatis standar form HTML
        event.preventDefault();

        // Ambil nilai input dan bersihkan spasi
        let customUrl = input.value.trim();

        // Validasi: Jika user lupa mengetik "http://", tambahkan otomatis
        if (customUrl && !customUrl.startsWith("http")) {
            customUrl = `${protocol}://${customUrl}`;
        }

        // Update variabel endpoint_url (gunakan input baru atau tetap yang lama jika kosong)
        endpoint_url = customUrl || endpoint_url;

        // Simpan ke memori browser (LocalStorage) agar tidak hilang saat direfresh
        localStorage.setItem("endpoint_url", endpoint_url);

        // Debugging: Tampilkan IP baru (sebenarnya opsional karena ada reload di bawah)
        const newIpMatch = endpoint_url.match(ipRegex);
        const newIp = newIpMatch ? newIpMatch[0] : "Domain";
        if (output) output.textContent = `Active IP : ${newIp}`;

        // Reload halaman agar seluruh aplikasi menggunakan endpoint baru
        window.location.reload();
    });
}