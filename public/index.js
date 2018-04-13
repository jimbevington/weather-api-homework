const audioContext = new (window.AudioContext || window.webkitAudioContext);
const sine1 = audioContext.createOscillator();
const panner = audioContext.createStereoPanner();


sine1.connect(panner);
panner.connect(audioContext.destination);

// sine1.frequency.value = 500;

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

  // Get Useful Weather DATA
  const weatherData = getCurrentWeather(glasgowWeather);

  // generate HTML tags
  makeCurrentWeatherHTML(weatherData);

  // do something else with the data
  setMusicParameters(weatherData);

  // display current weather
  // display the 24 hrs weather
  // display the weather over 3 days

}


const getCurrentWeather = function(weather) {
//  Translates API data into useful format, returns an object

  // GET DATA
  const currentWeather = weather.list[0];
  const stats = currentWeather.main;

  const weatherData = {};
  // name
  weatherData.placeName = weather.city.name;
  // time
  weatherData.forecastTime = currentWeather.dt_txt;
  // type
  weatherData.weatherType = currentWeather.weather[0].main;
  // stats
  weatherData.temp = stats.temp;
  weatherData.pressure = stats.pressure;
  weatherData.humid = stats.humidity
  weatherData.clouds = currentWeather.clouds.all;
  weatherData.rain = currentWeather.rain['3h'];
  weatherData.windSpeed = currentWeather.wind.speed;
  weatherData.windDeg = currentWeather.wind.deg;

  return weatherData;

}

const makeCurrentWeatherHTML = function(weather){

  const currentForecastTag = document.getElementById('current-weather-forecast');

  // // PLACE NAME
  const locationTag = document.createElement('h3');
  locationTag.innerText = weather.placeName;

  const timeTag = document.createElement('h4');
  timeTag.innerHTML = weather.forecastTime;

  const weatherTypeTag = document.createElement('h4');
  weatherTypeTag.innerText = weather.weatherType;

  const statsArray = [weather.temp, weather.pressure, weather.humid, weather.clouds, weather.rain, weather.windSpeed, weather.windDeg];
  const statsLabels = ['Temp: ', "Pressure: ", "Humid: ", "Clouds: ", "Rain: ", "Wind Speed: ", "Wind Deg: "]

  const ul = document.getElementById('stats-list');

  for(let i = 0; i < statsArray.length; i++){
    const li = document.createElement('li');
    li.innerText = statsLabels[i] + statsArray[i];
    ul.appendChild(li);
  }

  for (let element of [locationTag, timeTag, weatherTypeTag, ul]){
    currentForecastTag.appendChild(element);
  }

}

const setMusicParameters = function(weather){

  // set the frequency by PRESSURE
  // const freq = scalePressureToFreq(weather.pressure);
  const freq = scaleInput(weather.pressure, 956, 1053, 100, 800);
  sine1.frequency.value = freq;

  // PAN POSITION BY WIND DEGREE ???
  // panner.pan.value = 0.4;

  // set interval

  // ...
  // ..
  // .

}

const scaleInput = function(inAmt, inMin, inMax, outMin, outMax){

  const percent = (inAmt - inMin) / (inMax - inMin);
  const result = percent * (outMax - outMin) + outMin;

  return result;
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

// // time stuff
//   let date = new Date();
//   let hour = date.getHours();
//   let min = date.getMinutes();

// sound stuff


  sine1.start();
  sine1.stop(1);

}

window.addEventListener('load', app);
