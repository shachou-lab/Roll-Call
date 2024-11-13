let rollCallData = [];
let countdownTimer;
const countdownDuration = 10; // 10 seconds
let acceptingSubmissions = false;

function submitRollCall() {
  if (!acceptingSubmissions) {
    document.getElementById('checkInStatus').innerText = "Roll call not active. Please wait for the timer.";
    return;
  }

  const name = document.getElementById('name').value;
  const id = document.getElementById('id').value;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const withinBounds = (latitude > 31.6000 && latitude < 31.8000) && 
                           (longitude > 130.9000 && longitude < 131.2000);

      if (withinBounds) {
        document.getElementById('locationStatus').innerText = "Location verified";
        saveRollCallData(name, id, latitude, longitude);
      } else {
        document.getElementById('locationStatus').innerText = "Outside allowed location";
      }
    });
  } else {
    document.getElementById('locationStatus').innerText = "Geolocation not supported by this browser.";
  }
}

function saveRollCallData(name, id, latitude, longitude) {
  const timestamp = new Date().toLocaleString();
  rollCallData.push({ name, id, latitude, longitude, timestamp });
  document.getElementById('checkInStatus').innerText = "Check-In Successful!";
}

function startCountdown() {
  acceptingSubmissions = true;
  let timeLeft = countdownDuration;
  document.getElementById('timer').innerText = `Roll call active for ${timeLeft} seconds...`;

  countdownTimer = setInterval(() => {
    timeLeft -= 1;
    document.getElementById('timer').innerText = `Roll call active for ${timeLeft} seconds...`;

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      acceptingSubmissions = false;
      promptFileDownload();
    }
  }, 1000);
}

function promptFileDownload() {
  const data = JSON.stringify(rollCallData, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "rollcall_data.json";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  document.getElementById('timer').innerText = "Download complete!";
}
