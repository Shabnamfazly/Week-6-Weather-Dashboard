const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = '3770aa61038a0816864d556d797ecb9f ';
const MAX_DAILY_FORECAST = 5;

const cityInput = document.getElementById('city');
const searchButton = document.getElementById('Search');
const forecastList = document.getElementById('forecast-days')

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

const lookupCity = (search) => {

   
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            saveLocation(data[0].name)
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

    document.getElementById('temperature_value').textContent = `${currentWeather.temp}°`;
    document.getElementById('wind_value').textContent = `${currentWeather.wind_speed}MPH`;
    document.getElementById('humidity_value').textContent = `${currentWeather.humidity}%`;
    document.getElementById('uv-index-value').textContent = `${currentWeather.uvi}%`;
}

const displayWeatherForecast = (weatherData) => {

    const dailyData = weatherData
console.log(weatherData)
    document.getElementById('forecast').style.display = 'block';
    forecastList.innerHTML = '';
    for (let i = 1; i< MAX_DAILY_FORECAST; i++) {

        
    
        const day = new Date((dailyData.daily[i].dt)*1000).toLocaleDateString()
        const temperature = `Temperature:${dailyData.daily[i].temp.day}°`;
        const humidity = `Humidity:${dailyData.daily[i].humidity}%`;
        const wind = `Wind:${dailyData.daily[i].wind_speed}MPH`;
       
        
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

    
    const getWeather = (lat, lon) =>{
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
  

    searchButton.addEventListener ('click', getCity);
   


console.log()

const saveLocation = (location) => {
const locations = retrieveLocations()

    locations.push(location);
    localStorage.setItem('city', JSON.stringify(locations));
    retrieveLocations()
  }


const retrieveLocations = () => {
  const existingLocations = JSON.parse(localStorage.getItem('city'))||[];
  console.log(existingLocations)
 

  const locationContainer = document.getElementById('recent-cities');
  locationContainer.innerHTML = '';
  existingLocations.forEach(location => {
    const locationElement = document.createElement('div');
    locationElement.textContent = location;
    locationContainer.appendChild(locationElement);
  });
  return existingLocations
};

retrieveLocations();