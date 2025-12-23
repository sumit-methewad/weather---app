
  
  const API_KEY = "8bb48312ef8645efaf283532251912";
  const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

  function setBackground(text){
    const c = text.toLowerCase();
    if(c.includes('sun')||c.includes('clear'))
      document.body.style.background='linear-gradient(135deg,#fbc531,#4cd137)';
    else if(c.includes('cloud'))
      document.body.style.background='linear-gradient(135deg,#7f8fa6,#718093)';
    else if(c.includes('rain')||c.includes('drizzle'))
      document.body.style.background='linear-gradient(135deg,#2f3640,#353b48)';
    else if(c.includes('snow'))
      document.body.style.background='linear-gradient(135deg,#dcdde1,#f5f6fa)';
    else
      document.body.style.background='linear-gradient(135deg,#1e3c72,#2a5298)';
  }

  function renderWeather(data){
    const cur = document.getElementById('current');
    const fc = document.getElementById('forecast');

    setBackground(data.current.condition.text);

    cur.innerHTML = `
      <img src="${data.current.condition.icon}">
      <div class="temp">${data.current.temp_c}°C</div>
      <div class="city">${data.location.name}, ${data.location.country}</div>
      <div class="cond">${data.current.condition.text}</div>
      <div class="details">
        <div>Humidity<br>${data.current.humidity}%</div>
        <div>Wind<br>${data.current.wind_kph} km/h</div>
      </div>`;

    let html = '<h3>7 Day Forecast</h3><div class="days">';
    data.forecast.forecastday.forEach(d=>{
      const day = new Date(d.date).toLocaleDateString('en-US',{weekday:'short'});
      html += `
        <div class="day">
          <div class="d">${day}</div>
          <img src="${d.day.condition.icon}">
          <div class="t">${d.day.avgtemp_c}°C</div>
        </div>`;
    });
    html += '</div>';
    fc.innerHTML = html;
  }

  function getCityWeather(){
    const city = document.getElementById('cityInput').value.trim();
    const err = document.getElementById('error');
    err.innerText='';

    if(!city){ err.innerText='Please enter city name'; return; }

    fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&days=7`)
      .then(r=>r.json())
      .then(data=>{
        renderWeather(data);
        document.getElementById('cityInput').value='';
      })
      .catch(()=> err.innerText='City not found');
  }

  function getLocationWeather(){
    const err = document.getElementById('error');
    err.innerText='';

    if(!navigator.geolocation){
      err.innerText='Geolocation not supported';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos=>{
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        fetch(`${BASE_URL}?key=${API_KEY}&q=${lat},${lon}&days=7`)
          .then(r=>r.json())
          .then(data=> renderWeather(data));
      },
      ()=> err.innerText='Location permission denied'
    );
  }
