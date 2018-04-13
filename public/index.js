/// GENERIC

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();   //  a request object

  request.open('GET', url); // make the request

  request.addEventListener('load', callback)  //  when response, exec callback

  request.send();
};

const getWeatherData = function(){

  if(this.status !== 200) return;   // Check if response has worked
  const jsonString = this.responseText;
  const glasgowWeather = JSON.parse(jsonString);

  displayCurrentWeather(glasgowWeather);

  // display current weather
  // display the 24 hrs weather
  // display the weather over 3 days

}

const displayCurrentWeather = function(weather) {

  const currentForecastTag = document.getElementById('current-weather-forecast');

  const placeName = weather.city.name;
  const locationTag = document.createElement('h3');
  locationTag.innerText = placeName;

  currentForecastTag.appendChild(locationTag);

  const currentWeather = weather.list[0];
  const stats = currentWeather.main;

  const forecastTime = currentWeather.dt_txt;
  const weatherType = currentWeather.weather[0].main;
  const temp = stats.temp;
  const pressure = stats.pressure;
  const humid = stats.humidity
  const clouds = currentWeather.clouds.all;
  const rain = currentWeather.rain['3h'];
  const wind = currentWeather.wind;

}

/// INFO I CAN GET:

/// WEATHER FORECAST OVER DAYS
// const forecast = glasgowWeather.list;

/// TODAYS WEATHER
// const todaysWeather = glasgowWeather.list[1];

// CLOUDINESS .clouds
// TEMPERATURE .main.temp
// PRESSURE .main.pressure
// HUMIDITY .main.humidity
// WIND .wind
// RAIN .rain

var app = function(){

  const glasgowWeatherURL = "http://api.openweathermap.org/data/2.5/forecast?id=3333231&APPID=d7d64ab41161dd5f312ccbe208418afe";
  makeRequest(glasgowWeatherURL, getWeatherData);

}

window.addEventListener('load', app);
