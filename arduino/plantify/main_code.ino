void sensor_random() {
  temp = random(0, 1000) / 10.0;
  ph = random(0, 140) / 10.0;
  tds = random(0, 10000) / 10.0;
  light = random(0, 10000) / 10.0;
  tank1 = random(0, 100);
  tank2 = random(0, 100);
  tank3 = random(0, 100);
  tank4 = random(0, 100); 
}

void logic() {
  if (ph >= ph_min && ph <= ph_max) {  //ideal
    pompa_up = 0;
    pompa_down = 0;
    stat_ph = "Ideal";
    digitalWrite(D1, HIGH);
    digitalWrite(D3, HIGH);
  } else if (ph < ph_min) {
    pompa_up = 1;
    pompa_down = 0;
    stat_ph = "Low";
    digitalWrite(D1, LOW);
    digitalWrite(D3, HIGH);
  } else if (ph > ph_max) {
    pompa_up = 0;
    pompa_down = 1;
    stat_ph = "High";
    digitalWrite(D1, HIGH);
    digitalWrite(D3, LOW);
  }

  if (tds >= tds_min && tds <= tds_max) {  //ideal
    pompa_a = 0;
    pompa_b = 0;
    stat_ppm = "Ideal";
    digitalWrite(D4, HIGH);
    digitalWrite(D5, HIGH);
  } else {
    pompa_a = 1;
    pompa_b = 1;
    stat_ppm = "Low";
    digitalWrite(D4, LOW);
    digitalWrite(D5, LOW);
  }
}