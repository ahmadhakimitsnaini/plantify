#include <ArduinoJson.h>

// ==========================================
// FUNGSI UTAMA: FETCH DATA (GET & POST)
// ==========================================
/**
 * Melakukan request HTTP ke server.
 * @param method: "GET" atau "POST"
 * @param endpoint_path: Path spesifik API (misal: "/update_data.php")
 */
void fetch_data(String method, String endpoint_path) {
  WiFiClient client;
  HTTPClient http;
  
  // 1. MEMULAI KONEKSI
  // Hati-hati: Pastikan 'endpoint' (global) tidak berakhiran slash jika path berawalan slash
  // Contoh: endpoint = "http://192.168.1.25", path = "/plantify/api/..."
  String full_url = endpoint + endpoint_path; 
  
  // Debug URL (Opsional, nyalakan jika koneksi gagal terus)
  // Serial.print("Connecting to: "); Serial.println(full_url);

  http.begin(client, full_url);
  http.addHeader("Content-Type", "application/json"); 

  int httpcode = 0; 

  // ==========================================
  // LOGIKA REQUEST (GET vs POST)
  // ==========================================
  if (method == "GET") {
    // Kirim request GET
    httpcode = http.GET();
  } 
  else if (method == "POST") {
    // --- PERSIAPAN DATA JSON UNTUK DIKIRIM ---
    
    // Alokasi Memori:
    // Data Anda memiliki sekitar 14 key-value. 
    // Estimasi: 14 field x ~20 chars + overhead JSON brackets/quotes = ~350 bytes.
    // Buffer 512 bytes adalah ukuran yang aman (safety margin).
    StaticJsonDocument<512> json_doc; 

    // Mengisi JSON dengan nilai variabel Global (dari sensor & status pompa)
    // String(val, 1) membatasi float menjadi 1 angka belakang koma untuk menghemat paket data
    json_doc["sensor1"] = String(temp, 1);  // Suhu
    json_doc["sensor2"] = String(ph, 1);    // pH
    json_doc["sensor3"] = String(tds, 0);   // TDS (biasanya bulat)
    json_doc["sensor4"] = String(light, 0); // Cahaya
    
    // Level Air
    json_doc["tank1"] = String(tank1, 0);
    json_doc["tank2"] = String(tank2, 0);
    json_doc["tank3"] = String(tank3, 0);
    json_doc["tank4"] = String(tank4, 0);

    // Status Pompa (1 = ON, 0 = OFF)
    json_doc["stat_pompa_1"] = pompa_up;   
    json_doc["stat_pompa_2"] = pompa_down;
    json_doc["stat_pompa_3"] = pompa_a;
    json_doc["stat_pompa_4"] = pompa_b;
    
    // Status Logika
    json_doc["stat_ph"] = stat_ph;
    json_doc["stat_ppm"] = stat_ppm;

    // Serialisasi: Mengubah objek JSON menjadi String panjang
    String datastream;
    serializeJson(json_doc, datastream);
    
    // Kirim request POST dengan body JSON
    httpcode = http.POST(datastream);
  }

  // ==========================================
  // HANDLING RESPON SERVER
  // ==========================================
  if (httpcode > 0) { // Jika terkoneksi ke server
    String respon = http.getString();
    
    // Debugging respons hanya jika perlu (mengurangi spam serial monitor)
    // Serial.println("Respon " + method + ": " + respon);

    if (httpcode == 200) {
      // --- PROSES DATA DARI GET (AMBIL SETTING DARI DB) ---
      // Kita hanya butuh parsing JSON jika methodnya GET dan respons valid
      if (method == "GET" && respon.length() > 2) { 
        
        // Gunakan DynamicJsonDocument atau StaticJsonDocument<512>
        StaticJsonDocument<512> doc; 
        DeserializationError error = deserializeJson(doc, respon);

        if (!error) {
          // Parsing sukses: Update variabel batas (threshold) global
          // .as<float>() memastikan tipe data sesuai
          if (doc.containsKey("slider1")) ph_min = doc["slider1"].as<float>();
          if (doc.containsKey("slider2")) ph_max = doc["slider2"].as<float>();
          if (doc.containsKey("slider3")) tds_min = doc["slider3"].as<float>(); // Ubah ke float jika database float
          if (doc.containsKey("slider4")) tds_max = doc["slider4"].as<float>();
          
          Serial.println("Settings Updated from Server!");
        } else {
          Serial.print("JSON Parsing failed: ");
          Serial.println(error.c_str());
        }
      }
    } else {
      Serial.print("HTTP Error Code: ");
      Serial.println(httpcode);
    }
  } else {
    // Jika httpcode negatif (koneksi timeout, wifi putus, dll)
    Serial.print("Connection Failed: ");
    Serial.println(http.errorToString(httpcode).c_str());
  }

  // Wajib: Tutup koneksi untuk membebaskan memori
  http.end();
}

// ==========================================
// WRAPPER FUNCTIONS
// ==========================================
// Pastikan path ini benar relatif terhadap variabel 'endpoint' global Anda
void get_data() {
  // Contoh: endpoint global = "http://192.168.1.25"
  // Maka path di sini harus lengkap mulai dari root folder project
  fetch_data("GET", "/plantify/api/api_slider.php"); 
}

void post_data() {
  fetch_data("POST", "/plantify/api/api_data.php"); 
}