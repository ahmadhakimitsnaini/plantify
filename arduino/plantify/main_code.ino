// ==========================================
// 1. FUNGSI SIMULASI SENSOR
// ==========================================
/**
 * Menghasilkan nilai acak untuk keperluan debugging/testing
 * tanpa sensor fisik.
 * * Rumus: random(min, max) / 10.0
 * Contoh: random(0, 140) menghasilkan 0 s/d 139. 
 * Dibagi 10.0 menjadi 0.0 s/d 13.9 (Float)
 */
void sensor_random() {
  // Simulasi suhu (0.0 - 100.0 C)
  temp = random(0, 1000) / 10.0;
  
  // Simulasi pH (0.0 - 14.0)
  ph = random(0, 140) / 10.0;
  
  // Simulasi TDS/PPM (0.0 - 1000.0 ppm)
  tds = random(0, 10000) / 10.0;
  
  // Simulasi Cahaya/Lux
  light = random(0, 10000) / 10.0;
  
  // Simulasi Level Air Tangki (0 - 99 %)
  tank1 = random(0, 100);
  tank2 = random(0, 100);
  tank3 = random(0, 100);
  tank4 = random(0, 100); 
}

// ==========================================
// 2. FUNGSI LOGIKA KONTROL (OTOMASI)
// ==========================================
/**
 * Mengontrol relay pompa berdasarkan pembacaan sensor.
 * Menggunakan logika "Active LOW" (Umum pada modul Relay Arduino).
 * LOW = Relay Nyala (ON)
 * HIGH = Relay Mati (OFF)
 */
void logic() {
  // --- KONTROL pH AIR ---
  
  // KONDISI 1: pH Ideal (Dalam rentang Min & Max)
  if (ph >= ph_min && ph <= ph_max) {  
    pompa_up = 0;   // Status data: OFF
    pompa_down = 0; // Status data: OFF
    stat_ph = "Ideal";
    
    // Matikan kedua pompa (Active LOW: HIGH = Mati)
    digitalWrite(D1, HIGH); 
    digitalWrite(D3, HIGH);
    
  // KONDISI 2: pH Terlalu Rendah (Asam) -> Nyalakan pH Up (Basa)
  } else if (ph < ph_min) {
    pompa_up = 1;   // Status data: ON
    pompa_down = 0; 
    stat_ph = "Low";
    
    // Nyalakan Pompa pH Up (D1)
    digitalWrite(D1, LOW);  // ON
    digitalWrite(D3, HIGH); // OFF
    
  // KONDISI 3: pH Terlalu Tinggi (Basa) -> Nyalakan pH Down (Asam)
  } else if (ph > ph_max) {
    pompa_up = 0;
    pompa_down = 1; // Status data: ON
    stat_ph = "High";
    
    // Nyalakan Pompa pH Down (D3)
    digitalWrite(D1, HIGH); // OFF
    digitalWrite(D3, LOW);  // ON
  }

  // --- KONTROL NUTRISI (TDS/PPM) ---
  
  // KONDISI 1: Nutrisi Ideal
  if (tds >= tds_min && tds <= tds_max) {  
    pompa_a = 0;
    pompa_b = 0;
    stat_ppm = "Ideal";
    
    // Matikan Pompa Nutrisi A & B
    digitalWrite(D4, HIGH);
    digitalWrite(D5, HIGH);
    
  // KONDISI 2: Nutrisi Tidak Ideal (Kurang atau Lebih)
  // CATATAN PENTING: Logika "else" ini akan menyalakan pompa
  // baik saat TDS kurang MAUPUN saat TDS berlebih.
  } else {
    pompa_a = 1;
    pompa_b = 1;
    stat_ppm = "Correction"; // Mengganti "Low" jadi general karena bisa jadi High
    
    // Nyalakan Pompa Nutrisi A & B
    digitalWrite(D4, LOW); // ON
    digitalWrite(D5, LOW); // ON
  }
}