/**
 * Fungsi untuk menentukan salam berdasarkan waktu lokal pengguna.
 * Menggunakan format 24 jam (0 - 23).
 * * @returns {string} Pesan salam (Morning/Afternoon/Evening)
 */
function getGreeting() {
  // 1. Membuat objek Date untuk mengambil waktu saat ini dari sistem pengguna
  const now = new Date();
  
  // 2. Mengambil komponen jam saja (integer 0 s.d 23)
  const hours = now.getHours();

  // 3. Logika percabangan waktu
  if (hours < 12) {
    // Berjalan dari jam 00:00 sampai 11:59
    return "Good Morning!";
  } else if (hours < 18) {
    // Berjalan dari jam 12:00 sampai 17:59
    return "Good Afternoon!";
  } else {
    // Berjalan dari jam 18:00 sampai 23:59
    return "Good Evening!";
  }
}

// 4. Eksekusi: Menampilkan salam ke halaman web
// Ambil elemen target
const greetingElement = document.getElementById("greeting");

// Pastikan elemen ditemukan sebelum mengubah isinya (Best Practice)
if (greetingElement) {
  greetingElement.textContent = getGreeting();
  // Opsional: Log ke console untuk debugging
  // console.log(`Greeting set to: ${getGreeting()} at ${new Date().getHours()} hours.`);
} else {
  console.warn('Element dengan ID "greeting" tidak ditemukan.');
}