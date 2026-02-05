#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// INISIALISASI GLOBAL
float temp, ph, tds, light, tank1, tank2, tank3, tank4;
float ph_min, ph_max, tds_min, tds_max;
int pompa_up, pompa_down, pompa_a, pompa_b;
String stat_ph, stat_ppm;

// INISIALISASI HTTP
String endpoint = "http://192.168.1.25/plantify/api";  

const char* ssid = "MATLABUSSALIK";         
const char* password = "merdekasejati";  

void setup() {
  Serial.begin(115200);

  pinMode(D1, OUTPUT);  //pompa ph up
  pinMode(D3, OUTPUT);  //pompa ph down
  pinMode(D4, OUTPUT);  //pompa nutrisi a
  pinMode(D5, OUTPUT);  //pompa nutrisi b

  // Memulai koneksi ke jaringan WiFi
  WiFi.begin(ssid, password);

  // Menunggu hingga terhubung
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Menampilkan informasi koneksi WiFi
  Serial.println("");
  Serial.println("WiFi terhubung");
  Serial.println("Alamat IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  sensor_random();
  logic();
  get_data();
  post_data();
  print();
  delay(500);
}