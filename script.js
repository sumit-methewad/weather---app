
  

    const API_KEY = "8bb48312ef8645efaf283532251912";
    const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
    
    const defaultConfig = {
      app_title: "Weather Forecast",
      search_placeholder: "Search city (e.g., Mumbai, Pune, Delhi)",
      primary_color: "#3b82f6",
      secondary_color: "#8b5cf6",
      text_color: "#ffffff",
      background_start: "#1e3a8a",
      background_end: "#312e81"
    };
    
    let currentWeatherData = null;

    function createWeatherEffect(weatherCondition) {
      const container = document.getElementById('weatherEffectContainer');
      container.innerHTML = '';
      
      const condition = weatherCondition.toLowerCase();
      
      if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        createRainEffect(container, 100);
      }
      else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet')) {
        createSnowEffect(container, 80);
      }
      else if (condition.includes('storm') || condition.includes('thunder')) {
        createRainEffect(container, 150);
      }
      else if (condition.includes('cloud') || condition.includes('overcast')) {
        createRainEffect(container, 40);
      }
    }
    
    function createRainEffect(container, count) {
      for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(drop);
      }
    }
    
    function createSnowEffect(container, count) {
      for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        flake.style.animationDelay = Math.random() * 2 + 's';
        flake.style.width = (Math.random() * 6 + 4) + 'px';
        flake.style.height = flake.style.width;
        container.appendChild(flake);
      }
    }
    
    function showLoading() {
      document.getElementById('loadingContainer').classList.remove('hidden');
      document.getElementById('weatherContainer').classList.add('hidden');
      document.getElementById('errorContainer').classList.add('hidden');
    }
    
    function hideLoading() {
      document.getElementById('loadingContainer').classList.add('hidden');
    }
    
    function showError(message) {
      document.getElementById('errorMessage').textContent = message;
      document.getElementById('errorContainer').classList.remove('hidden');
      document.getElementById('weatherContainer').classList.add('hidden');
      hideLoading();
    }
    
    function getWeatherEmoji(condition) {
      const text = condition.toLowerCase();
      if (text.includes('sunny') || text.includes('clear')) return '☀️';
      if (text.includes('cloud')) return '☁️';
      if (text.includes('rain')) return '🌧️';
      if (text.includes('storm') || text.includes('thunder')) return '⛈️';
      if (text.includes('snow')) return '❄️';
      if (text.includes('mist') || text.includes('fog')) return '🌫️';
      return '🌤️';
    }
    
    function displayWeather(data) {
      currentWeatherData = data;
      
      createWeatherEffect(data.current.condition.text);
      
      const container = document.getElementById('weatherContainer');
      container.innerHTML = '';
      
      const currentCard = document.createElement('div');
      currentCard.className = 'weather-card bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20';
      
      const temp = data.current.temp_c;
      const tempPercentage = Math.min((temp + 10) / 60 * 100, 100);
      
      currentCard.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <h2 class="text-4xl font-bold text-white mb-2">${data.location.name}, ${data.location.country}</h2>
            <p class="text-blue-200 text-lg">${new Date(data.location.localtime).toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="text-center">
            <div class="text-8xl mb-2">${getWeatherEmoji(data.current.condition.text)}</div>
            <p class="text-white text-2xl">${data.current.condition.text}</p>
          </div>
          
          <div class="text-center">
            <div class="text-7xl font-bold text-white mb-2">${temp}°C</div>
            <div class="w-64 bg-white/20 rounded-full h-6 overflow-hidden mb-4">
              <div class="temp-bar h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full" style="--bar-width: ${tempPercentage}%"></div>
            </div>
            <p class="text-blue-200">Feels like ${data.current.feelslike_c}°C</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div class="stat-card bg-white/10 rounded-xl p-4 text-center cursor-pointer">
            <p class="text-blue-200 mb-2">💨 Wind</p>
            <p class="text-white text-2xl font-semibold">${data.current.wind_kph} km/h</p>
          </div>
          <div class="stat-card bg-white/10 rounded-xl p-4 text-center cursor-pointer">
            <p class="text-blue-200 mb-2">💧 Humidity</p>
            <p class="text-white text-2xl font-semibold">${data.current.humidity}%</p>
          </div>
          <div class="stat-card bg-white/10 rounded-xl p-4 text-center cursor-pointer">
            <p class="text-blue-200 mb-2">🌡️ Pressure</p>
            <p class="text-white text-2xl font-semibold">${data.current.pressure_mb} mb</p>
          </div>
          <div class="stat-card bg-white/10 rounded-xl p-4 text-center cursor-pointer">
            <p class="text-blue-200 mb-2">👁️ Visibility</p>
            <p class="text-white text-2xl font-semibold">${data.current.vis_km} km</p>
          </div>
        </div>
      `;
      
      container.appendChild(currentCard);
      
      const forecastCard = document.createElement('div');
      forecastCard.className = 'weather-card bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20';
      forecastCard.style.animationDelay = '0.2s';
      forecastCard.innerHTML = '<h3 class="text-2xl font-bold text-white mb-4">📅 7 Day Forecast</h3>';
      
      const forecastGrid = document.createElement('div');
      forecastGrid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3';
      
      data.forecast.forecastday.forEach((day, index) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'stat-card bg-white/10 rounded-xl p-3 cursor-pointer';
        dayCard.style.animationDelay = `${0.3 + index * 0.1}s`;
        dayCard.style.animation = 'slideUp 0.6s ease-out';
        
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayTemp = day.day.avgtemp_c;
        const dayTempPercentage = Math.min((dayTemp + 10) / 60 * 100, 100);
        
        dayCard.innerHTML = `
          <p class="text-blue-200 font-semibold text-sm mb-1">${dayName}</p>
          <p class="text-white/70 text-xs mb-2">${date.getDate()}/${date.getMonth() + 1}</p>
          <div class="text-3xl text-center mb-2">${getWeatherEmoji(day.day.condition.text)}</div>
          <p class="text-white text-center text-xs mb-2 h-8 overflow-hidden">${day.day.condition.text}</p>
          <div class="text-center mb-2">
            <p class="text-white text-xl font-bold">${dayTemp}°C</p>
            <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden mt-1">
              <div class="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full transition-all duration-1000" style="width: ${dayTempPercentage}%"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-blue-200 mb-2">
            <span>↑${day.day.maxtemp_c}°</span>
            <span>↓${day.day.mintemp_c}°</span>
          </div>
          <div class="pt-2 border-t border-white/20">
            <div class="flex justify-between text-xs text-white/70 mb-1">
              <span>🌧️</span>
              <span>${day.day.daily_chance_of_rain}%</span>
            </div>
            <div class="flex justify-between text-xs text-white/70">
              <span>💨</span>
              <span>${day.day.maxwind_kph}</span>
            </div>
          </div>
        `;
        
        forecastGrid.appendChild(dayCard);
      });
      
      forecastCard.appendChild(forecastGrid);
      container.appendChild(forecastCard);
      
      container.classList.remove('hidden');
      hideLoading();
    }
    
    async function fetchWeather(city) {
      showLoading();
      
      try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no`);
        
        if (!response.ok) {
          throw new Error('City not found. Please try another city.');
        }
        
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        showError(error.message || 'Something went wrong. Please try again.');
      }
    }
    
    async function getLocationWeather() {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported, loading Mumbai weather');
        await fetchWeather('Mumbai');
        return;
      }
      
      showLoading();
      console.log('Requesting location permission...');
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Location detected:', position.coords);
          const { latitude, longitude } = position.coords;
          await fetchWeather(`${latitude},${longitude}`);
        },
        async (error) => {
          console.log('Location error:', error.code, error.message);
          
          // Automatically load Mumbai weather on any error
          if (error.code === 1) {
            console.log('Permission denied, loading Mumbai weather');
          } else if (error.code === 2) {
            console.log('Position unavailable, loading Mumbai weather');
          } else if (error.code === 3) {
            console.log('Timeout, loading Mumbai weather');
          }
          
          await fetchWeather('Mumbai');
        },
        options
      );
    }
    
    const searchInput = document.getElementById('citySearch');
    
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) {
        document.getElementById('weatherContainer').classList.add('hidden');
        document.getElementById('errorContainer').classList.add('hidden');
      }
    });
    
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const city = searchInput.value.trim();
      
      if (city) {
        await fetchWeather(city);
        searchInput.value = '';
      }
    });
    
    document.getElementById('locationBtn').addEventListener('click', () => {
      getLocationWeather();
    });
    
    async function onConfigChange(config) {
      const titleElement = document.getElementById('appTitle');
      const appElement = document.getElementById('app');
      
      titleElement.textContent = config.app_title || defaultConfig.app_title;
      searchInput.placeholder = config.search_placeholder || defaultConfig.search_placeholder;
      
      const bgStart = config.background_start || defaultConfig.background_start;
      const bgEnd = config.background_end || defaultConfig.background_end;
      appElement.className = `h-full w-full overflow-auto relative`;
      appElement.style.background = `linear-gradient(to bottom right, ${bgStart}, ${bgEnd})`;
      
      if (currentWeatherData) {
        displayWeather(currentWeatherData);
      }
    }
    
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
          recolorables: [
            {
              get: () => config.background_start || defaultConfig.background_start,
              set: (value) => {
                config.background_start = value;
                window.elementSdk.setConfig({ background_start: value });
              }
            },
            {
              get: () => config.background_end || defaultConfig.background_end,
              set: (value) => {
                config.background_end = value;
                window.elementSdk.setConfig({ background_end: value });
              }
            },
            {
              get: () => config.primary_color || defaultConfig.primary_color,
              set: (value) => {
                config.primary_color = value;
                window.elementSdk.setConfig({ primary_color: value });
              }
            },
            {
              get: () => config.text_color || defaultConfig.text_color,
              set: (value) => {
                config.text_color = value;
                window.elementSdk.setConfig({ text_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ["app_title", config.app_title || defaultConfig.app_title],
          ["search_placeholder", config.search_placeholder || defaultConfig.search_placeholder]
        ])
      });
    }
    
    // Auto-detect location on page load
    getLocationWeather();

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9b25dffe44d86091',t:'MTc2NjQ3MjEwNS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
