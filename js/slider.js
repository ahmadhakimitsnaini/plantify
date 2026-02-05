document.addEventListener("DOMContentLoaded", function () {
  const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6'];
  const displayElements = {
    slider1: 'slider-1',
    slider2: 'slider-2',
    slider3: 'slider-3',
    slider4: 'slider-4',
    slider5: 'slider-5',
    slider6: 'slider-6',
  };

  // Fungsi untuk update tampilan slider value
  const updateSliderDisplay = () => {
    sliders.forEach(id => {
      const slider = document.getElementById(id);
      document.getElementById(displayElements[id]).textContent = slider.value;
    });
  };

  // Fungsi untuk debounce
  let debounceTimers = {};
  const debounce = (func, id, delay) => {
    clearTimeout(debounceTimers[id]);
    debounceTimers[id] = setTimeout(func, delay);
  };

  // Fungsi untuk fetch nilai slider dari server
  const getSliders = async () => {
    try {
      const response = await fetch(endpoint_url + '/plantify/api/api_slider.php');
      const data = await response.json();

      sliders.forEach(id => {
        if (data[id] !== undefined) {
          document.getElementById(id).value = data[id];
        }
      });

      updateSliderDisplay();
    } catch (error) {
      console.error("Error loading slider values:", error);
    }
  };

  // Fungsi untuk menyimpan nilai slider ke server
  const saveSliderValue = async (id, value) => {
    const sliderData = { [id]: value };
    try {
      const response = await fetch(endpoint_url + '/plantify/api/api_slider.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliderData),
      });
      const responseData = await response.json();
      console.log(`Slider ${id} updated to ${value}. Server response:`, responseData);
    } catch (error) {
      console.error(`Error sending value of slider ${id}:`, error);
    }
  };

  // Pasang event listener pada setiap slider
  sliders.forEach(id => {
    const slider = document.getElementById(id);

    slider.addEventListener('input', () => {
      updateSliderDisplay();
      debounce(() => saveSliderValue(id, slider.value), id, 500); // Delay 300ms sebelum POST
    });
  });

  // Ambil nilai slider saat halaman dimuat
  getSliders();
});
