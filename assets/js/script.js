const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
const MAX_DAILY_FORECAST = 5;

const recentCities = [];

const getCity = () => {
    
    const userCity = cityInput.value;
    
    if (userCity === '') {
        setCityError('Please enter a city');
    }else {
        lookupCity(userCity);
    }
}

const clearError = () => {
    const errorDisplay = document.getElementById ('error');
    errorDisplay.textContent = '';
}

const setCityError = (text) => {
    const errorDisplay = document.getElementById('error');
    errorDisplay.textContent = text;

    setTimeout(clearError, 3000);
}

const lookupLocation = (search) => {

   
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            
            var lat = data[0].lat;
            var lon = data[0].lon;

            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
            console.log(apiUrl);
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {

                    console.log(data);

                    
                    displayCurrentWeather(data);

                    
                    displayWeatherForecast(data);
                })

                displayWeather
        });
}

const displayCurrentWeather = (weatherData) => {
    const currentWeather = weatherData.current;

    document.getElementById('temperature_value').textContent = `${currentWeather.temperature}°`;
    document.getElementById('wind_value').textContent = `${currentWeather.wind_speed}MPH`;
    document.getElementById('humidity_value').textContent = `${currentWeather.humidity}%`;
    document.getElementById('uv-index-value').textContent = `${currentWeather.uvi}%`;
}

const displayWeatherForecast = (weatherData) => {

    const dailyData = weatherData.daily;

    document.getElementById('forecast').style.display = 'block';
    forecastList.innerHTML = '';

    for (let i = 0; i< MAX_DAILY_FORECAST; i++) {

        const dailyForecast = dailyData[i];
        const day = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB',{weekday: 'long'});
        const temperature = `${dailyForecast.temperature.day}°`;
        const humidity = `${dailyForecast.humidity}%`;
        const wind = `${dailyForecast.wind_speed}MPH`;
        
        const newForecast = document.createElement('div');
        newForecast.classList.add('forecast-day');
        newForecast.innerHTML= `<div class= "weather-details">
          <div class = "date">
            <span> ${day}</span>
          <div>
          <div class = "temperature">
            <span>${temperature}</span>
          </div>
          <div class = "wind"> 
            <span>${wind}></span>
          </div>
          <div class = "humidity">
            <span>${humidity}</span>
          </div>
        </div>`;
        
        forecastList.appendChild(newForecast);
        }


    } 
    const getWeather = (lat, long) =>{
        var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
        console.log(apiUrl);
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayCurrentWeather(data);
            displayWeatherForecast(data);

        })
    }

    const displayWeather = (weatherData) => {
        document.getElementById('city-name').textContent = `${weatherData.name}, ${weatherData.country}`;
        getWeather(weatherData.lat,weatherData.lon);
    }
    const cityInput = document.getElementById('city');
    const searchButton = document.getElementById('search');

    searchButton.addEventListener('click',getCity);