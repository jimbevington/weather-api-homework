// AUDIO SETUP

const audioContext = new (window.AudioContext || window.webkitAudioContext);

// OSCILLATORS
const sine1 = audioContext.createOscillator();
const gain1 = audioContext.createGain();
sine1.connect(gain1);

const sine2 = audioContext.createOscillator();
const gain2 = audioContext.createGain();
sine2.connect(gain2);

const sine3 = audioContext.createOscillator();
const gain3 = audioContext.createGain();
sine3.connect(gain3);

const sine4 = audioContext.createOscillator();
const gain4 = audioContext.createGain();
sine4.connect(gain4);

const sine5 = audioContext.createOscillator();
const gain5 = audioContext.createGain();
sine5.connect(gain5);

const oscillators = [sine1, sine2, sine3, sine4, sine5];


// LFOs
const lfo1 = audioContext.createOscillator();
const lfoGain1 = audioContext.createGain();
lfo1.connect(lfoGain1);
const lfo2 = audioContext.createOscillator();
const lfoGain2 = audioContext.createGain();
lfo2.connect(lfoGain2);

// Connect LFOS
// Alternate between LFO 1 & 2 when connecting to Sines
for (let i = 0; i < oscillators.length; i++){
  if (i % 2 === 0){
    lfoGain1.connect(oscillators[i].detune);
  } else {
    lfoGain2.connect(oscillators[i].detune);
  }
}

const lfos = [lfo1, lfo2];



// MASTER VOLUME
const master = audioContext.createGain();
// initalise master at 0 volume
master.gain.setValueAtTime(0, audioContext.currentTime);

// connect Oscillators to Master
for (let gain of [gain1, gain2, gain3, gain4, gain5]){
  gain.gain = 0.2;
  gain.connect(master);
}

master.connect(audioContext.destination);




const startAudio = function(){
  master.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 2);
}

const stopAudio = function(){
  master.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 2);
}

/// API REQUESTS

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
  const freq = scaleInput(weather.pressure, 956, 1053, 100, 600);
  sine1.frequency.value = freq;


  const intervals = [1, 1.333, 1.5, 1.875, 2];

  for (let i = 0; i < oscillators.length; i++){
    oscillators[i].frequency.value = freq * intervals[i];
  }

  // PAN POSITION BY WIND DEGREE ???
  // panner.pan.value = 0.4;
  console.log(weather);
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

//  start the oscillators onLoad
  oscillators.forEach(sine => sine.start());
  // sine1.start();
  lfos.forEach(lfo => lfo.start());


// // time stuff
//   let date = new Date();
//   let hour = date.getHours();
//   let min = date.getMinutes();

// // sound stuff
  const playButton = document.getElementById('play-button');
  playButton.addEventListener('click', startAudio);

  const stopButton = document.getElementById('stop-button');
  stopButton.addEventListener('click', stopAudio);

}

window.addEventListener('load', app);
