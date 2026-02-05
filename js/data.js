async function load_data1() {
  try {
    const response = await fetch(endpoint_url + "/plantify/api/api_data.php");
    if (!response.ok) {
      throw new Error("Network error!");
    }
    const data = await response.json();
    // console.log(data);

    // Set data sensor dan tank
    document.getElementById("sensor1").textContent = data.sensor1 ?? "-";
    document.getElementById("sensor2").textContent = data.sensor2 ?? "-";
    document.getElementById("sensor3").textContent = data.sensor3 ?? "-";
    document.getElementById("sensor4").textContent = data.sensor4 ?? "-";
    document.getElementById("tank-1").textContent = (data.tank1 ?? "-") + "%";
    document.getElementById("tank-2").textContent = (data.tank2 ?? "-") + "%";
    document.getElementById("tank-3").textContent = (data.tank3 ?? "-") + "%";
    document.getElementById("tank-4").textContent = (data.tank4 ?? "-") + "%";
    document.getElementById("stat-3").textContent = data.stat_ph ?? "-";
    document.getElementById("stat-4").textContent = data.stat_ppm ?? "-";
    document.getElementById("timestamp").textContent = data.timestamp ?? "-";

    // Update status pompa
    for (let i = 1; i <= 4; i++) {
      const pompaElement = document.getElementById(`stat-pompa-${i}`);
      if (data[`stat_pompa_${i}`] === 1) {
        pompaElement.classList.add("text-green-500");
        pompaElement.classList.remove("text-gray-700");
      } else {
        pompaElement.classList.add("text-gray-700");
        pompaElement.classList.remove("text-green-500");
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function load_data2() {
  try {
    const response = await fetch(endpoint_url + "/plantify/api/api_slider.php");
    if (!response.ok) {
      throw new Error("Network error!");
    }
    const data = await response.json();
    // console.log(data);

    document.getElementById("ph-min").textContent = data.slider1 ?? "-";
    document.getElementById("ph-max").textContent = data.slider2 ?? "-";
    document.getElementById("ppm-min").textContent = data.slider3 ?? "-";
    document.getElementById("ppm-max").textContent = data.slider4 ?? "-";
    document.getElementById("growlight-set").textContent =
      data.slider5 + " %" ?? "-";
    document.getElementById("fan-set").textContent = data.slider6 + " %" ?? "-";
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Load data pertama kali dan secara periodik setiap 500 ms
load_data1();
load_data2();
setInterval(load_data1, 500);
