function getGreeting() {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good Morning!";
  } else if (hours < 18) {
    return "Good Afternoon!";
  } else {
    return "Good Evening!";
  }
}

// Set the greeting to the div
document.getElementById("greeting").textContent = getGreeting();