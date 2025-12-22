
    const API_KEY = "8bb48312ef8645efaf283532251912";
    const BASE_URL = "https://api.weatherapi.com/v1/current.json";

    function getWeather() {
      const city = document.getElementById("cityInput").value;
      const weatherDiv = document.getElementById("weather");
      const errorDiv = document.getElementById("error");

      weatherDiv.innerHTML = "";
      errorDiv.innerHTML = "";

      if (!city) {
        errorDiv.innerText = "Please enter a city name";
        return;
      }

      fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=yes`)
        .then(res => {
          if (!res.ok) throw new Error("City not found");
          return res.json();
        })
        .then(data => {
          const condition = data.current.condition.text.toLowerCase();

      
          const effectDiv = document.getElementById("effect");
          effectDiv.className = "";
          if (condition.includes("sun") || condition.includes("clear")) {
            document.body.style.background = "linear-gradient(135deg, #fbc531, #4cd137)";
            effectDiv.classList.remove('fog','rain');
          } else if (condition.includes("cloud")) {
            document.body.style.background = "linear-gradient(135deg, #7f8fa6, #718093)";
            effectDiv.classList.remove('fog','rain');
          } else if (condition.includes("rain") || condition.includes("drizzle")) {
            document.body.style.background = "linear-gradient(135deg, #2f3640, #353b48)";
            effectDiv.className = "rain";
          } else if (condition.includes("snow")) {
            document.body.style.background = "linear-gradient(135deg, #dcdde1, #f5f6fa)";
            effectDiv.className = "fog";
          } else {
            document.body.style.background = "linear-gradient(135deg, #1e3c72, #2a5298)";
          }

          weatherDiv.innerHTML = `
            <div class="city">${data.location.name}, ${data.location.country}</div>
            <img src="${data.current.condition.icon}" />
            <div class="temp">${data.current.temp_c}°C</div>
            <div class="condition">${data.current.condition.text}
 </div>

            <div class="details">
              <div>Humidity<br>${data.current.humidity}%</div>
              <div>Wind<br>${data.current.wind_kph} km/h</div>
            </div>
          `;
        })
        .catch(err => {
          errorDiv.innerText = err.message;
        });
    }
 
