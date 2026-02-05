void fetch_data(String method, String endpoint_path) {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, endpoint + endpoint_path);
  int httpcode;

  if (method == "GET") {
    httpcode = http.GET();
  } else if (method == "POST") {
    StaticJsonDocument<100> json_doc;
    json_doc["sensor1"] = String(temp, 1);
    json_doc["sensor2"] = String(ph, 1);
    json_doc["sensor3"] = String(tds, 0);
    json_doc["sensor4"] = String(light, 0);
    json_doc["tank1"] = String(tank1, 0);
    json_doc["tank2"] = String(tank2, 0);
    json_doc["tank3"] = String(tank3, 0);
    json_doc["tank4"] = String(tank4, 0);
    json_doc["stat_pompa_1"] = pompa_up;
    json_doc["stat_pompa_2"] = pompa_down;
    json_doc["stat_pompa_3"] = pompa_a;
    json_doc["stat_pompa_4"] = pompa_b;
    json_doc["stat_ph"] = stat_ph;
    json_doc["stat_ppm"] = stat_ppm;

    String datastream;
    serializeJson(json_doc, datastream);
    http.addHeader("Content-Type", "application/json");
    httpcode = http.POST(datastream);
  }

  if (httpcode == 200) {
    String respon = http.getString();
    Serial.println(String() + "Respons " + method + ": " + respon);

    if (method == "GET" && respon != "") {
      DynamicJsonDocument doc(100);
      deserializeJson(doc, respon);
      ph_min = doc["slider1"];
      ph_max = doc["slider2"];
      tds_min = doc["slider3"];
      tds_max = doc["slider4"];
    }
  } else {
    Serial.println(method + " Error!");
  }

  http.end();
}

// Fungsi untuk GET data
void get_data() {
  fetch_data("GET", "/api_slider.php");
}

// Fungsi untuk POST data ke api_data.php
void post_data() {
  fetch_data("POST", "/api_data.php");
}