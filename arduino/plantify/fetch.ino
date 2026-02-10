// Pastikan library ArduinoJson sudah terinstall (v6)
#include <ArduinoJson.h>

void fetch_data(String method, String endpoint_path) {
  WiFiClient client;
  HTTPClient http;
  
  // Memulai koneksi
  http.begin(client, endpoint + endpoint_path);
  http.addHeader("Content-Type", "application/json"); // Header dipasang global agar aman

  int httpcode = 0; // Inisialisasi dengan 0

  if (method == "GET") {
    httpcode = http.GET();
  } 
  else if (method == "POST") {
    // PERBAIKAN UTAMA: Ukuran buffer dinaikkan dari 100 ke 512
    // Data kamu memiliki sekitar 14 key-value pair, butuh space sekitar 300-400 byte.
    StaticJsonDocument<512> json_doc; 

    // Mengisi data (Pastikan variabel ini Global atau passing parameter)
    json_doc["sensor1"] = String(temp, 1);
    json_doc["sensor2"] = String(ph, 1);
    json_doc["sensor3"] = String(tds, 0);
    json_doc["sensor4"] = String(light, 0);
    
    json_doc["tank1"] = String(tank1, 0);
    json_doc["tank2"] = String(tank2, 0);
    json_doc["tank3"] = String(tank3, 0);
    json_doc["tank4"] = String(tank4, 0);

    // Pastikan nilai pompa berupa integer (1/0) atau boolean
    json_doc["stat_pompa_1"] = pompa_up;   
    json_doc["stat_pompa_2"] = pompa_down;
    json_doc["stat_pompa_3"] = pompa_a;
    json_doc["stat_pompa_4"] = pompa_b;
    
    json_doc["stat_ph"] = stat_ph;
    json_doc["stat_ppm"] = stat_ppm;
    
    // Tambahkan timestamp dari sisi alat jika perlu (opsional)
    // json_doc["timestamp"] = "2024-..."; 

    String datastream;
    serializeJson(json_doc, datastream);
    
    // Debugging: Lihat apa yang mau dikirim di Serial Monitor
    // Serial.println("Sending: " + datastream); 

    httpcode = http.POST(datastream);
  }

  // Cek respon server
  if (httpcode > 0) { // Cek apakah koneksi berhasil dulu
    String respon = http.getString();
    Serial.println("Respons " + method + " (" + String(httpcode) + "): " + respon);

    if (httpcode == 200) {
      // Hanya proses JSON jika method GET dan respon tidak kosong
      if (method == "GET" && respon != "" && respon != "{}") {
        // PERBAIKAN: Gunakan 512 juga untuk respon agar aman
        DynamicJsonDocument doc(512); 
        DeserializationError error = deserializeJson(doc, respon);

        if (!error) {
          // Parsing data slider ke variabel global
          // Gunakan casting float/int agar aman
          ph_min = doc["slider1"].as<float>();
          ph_max = doc["slider2"].as<float>();
          tds_min = doc["slider3"].as<int>();
          tds_max = doc["slider4"].as<int>();
          
          // Debugging hasil parsing
          // Serial.printf("Updated Limits: pH %.1f-%.1f, TDS %d-%d\n", ph_min, ph_max, tds_min, tds_max);
        } else {
          Serial.print("JSON Parsing failed: ");
          Serial.println(error.c_str());
        }
      }
    }
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(http.errorToString(httpcode).c_str());
  }

  http.end();
}

// Fungsi Wrapper tetap sama
void get_data() {
  fetch_data("GET", "/plantify/api/api_slider.php"); // Pastikan path sesuai server
}

void post_data() {
  fetch_data("POST", "/plantify/api/api_data.php"); // Pastikan path sesuai server
}