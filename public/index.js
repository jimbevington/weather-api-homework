

// AUDIO SETUP

const audioContext = new (window.AudioContext || window.webkitAudioContext);

// OSCILLATORS
const sine1 = audioContext.createOscillator();
const gain1 = audioContext.createGain();
const pan1 = audioContext.createStereoPanner();

const sine2 = audioContext.createOscillator();
const gain2 = audioContext.createGain();
const pan2 = audioContext.createStereoPanner();

const sine3 = audioContext.createOscillator();
const gain3 = audioContext.createGain();
const pan3 = audioContext.createStereoPanner();

const sine4 = audioContext.createOscillator();
const gain4 = audioContext.createGain();
const pan4 = audioContext.createStereoPanner();

const sine5 = audioContext.createOscillator();
const gain5 = audioContext.createGain();
const pan5 = audioContext.createStereoPanner();

const oscillators = [sine1, sine2, sine3, sine4, sine5];
const gains = [gain1, gain2, gain3, gain4, gain5];
const pans = [pan1, pan2, pan3, pan4, pan5];


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


// ROUTE:  Oscillators > Gains > Pans > Master
for (let i = 0; i < oscillators.length; i++){
  oscillators[i].connect(gains[i]);
  gains[i].connect(pans[i]);
  gains[i].gain = 0.2;
  pans[i].connect(master);
}

master.connect(audioContext.destination);




const startAudio = function(){
  master.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 2);
}

const stopAudio = function(){
  master.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 2);
}



// CITY DATA
const initializeCityList = function(){

  // console.log(cityList[0]);
  const citySelect = document.getElementById('cities-list');

  for (let i = 0; i < 200; i++){
    let option = document.createElement('option');
    option.value = cityList[i].id;
    option.innerText = cityList[i].name;
    citySelect.appendChild(option);
  }

}

const getCityWeather = function(){

  const cityId = this.value;

  const requestURL = makeUrl(cityId);

  makeRequest(requestURL, getWeatherData)

}

const makeUrl = function(cityId){

  const prefix = "http://api.openweathermap.org/data/2.5/forecast?id=";
  const suffix = "&APPID=d7d64ab41161dd5f312ccbe208418afe";
  const url = prefix.concat(cityId, suffix);
  return url;

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
  const weather = JSON.parse(jsonString);

  const weather24 = get24HoursWeather(weather);
  debugger;
  // Get Useful Weather DATA
  const weatherData = getCurrentWeather(weather);

  // generate HTML tags
  makeCurrentWeatherHTML(weatherData);

  // do something else with the data
  setMusicParameters(weatherData);

  // display current weather
  // display the 24 hrs weather
  // display the weather over 3 days

}

const get24HoursWeather = function(weather){
  
  const weather24 = [];
  for (let i = 0; i < 8; i++){
    weather24.push(weather.list[i]);
  }

  const weatherData = {};
  // name
  weatherData.placeName = weather.city.name;
  // // time
  weatherData.forecastTimes = [];
  weatherData.weatherType = [];
  weatherData.temps = [];
  weatherData.pressures = [];
  weatherData.humids = [];
  weatherData.clouds = [];
  weatherData.rains = [];
  weatherData.windSpeeds = [];
  weatherData.windDegs = [];

  weather24.forEach(forecast => {
    weatherData.forecastTimes.push(forecast.dt_txt);
    weatherData.weatherType.push(forecast.weather[0].main)
    weatherData.temps.push(forecast.main.temp);
    weatherData.pressures.push(forecast.main.pressure);
    weatherData.humids.push(forecast.main.humidity);
    weatherData.clouds.push(forecast.clouds.all);
    weatherData.rains.push(forecast.rain['3h']);
    weatherData.windSpeeds.push(forecast.wind.speed);
    weatherData.windDegs.push(forecast.wind.deg);
  })

  return weatherData;

}


const getCurrentWeather = function(weather) {
//  Translates API data into useful format, returns an object

  // GET DATA
  const currentWeather = weather.list[0];
  const stats = currentWeather.main;


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

  // clear Previous data
  // currentForecastTag.innerHTML = "";

  // // PLACE NAME
  const locationTag = document.getElementById('locationTag');
  locationTag.innerHTML = `<h2>${weather.placeName}</h2>`;

  const timeTag = document.getElementById('timeTag');
  timeTag.innerHTML = weather.forecastTime;

  const weatherTypeTag = document.getElementById('weatherTypeTag');
  weatherTypeTag.innerHTML = weather.weatherType;

  const statsArray = [weather.temp, weather.pressure, weather.humid, weather.clouds, weather.rain, weather.windSpeed, weather.windDeg];
  const statsLabels = ['Temp: ', "Pressure: ", "Humid: ", "Clouds: ", "Rain: ", "Wind Speed: ", "Wind Deg: "]

  const ul = document.getElementById('stats-list');
  ul.innerHTML = '';

  for(let i = 0; i < statsArray.length; i++){
    const li = document.createElement('li');
    li.innerText = statsLabels[i] + statsArray[i];
    ul.appendChild(li);
  }

  // for (let element of [locationTag, timeTag, weatherTypeTag, ul]){
  //   currentForecastTag.appendChild(element);
  // }

}

const setMusicParameters = function(weather){

  // ATMOSPERIC PRESSURE
  // sets Base Freq
  const freq = scaleInput(weather.pressure, 956, 1053, 80, 500);
  sine1.frequency.value = freq;

  // Hard Coded Intervals
  const intervals = [1, 1.333, 1.5, 1.875, 2];
  for (let i = 0; i < oscillators.length; i++){
    oscillators[i].frequency.value = freq * intervals[i];
  }

  // WIND SPEED
  // sets LFO Freq
  const lfoFreq = scaleInput(weather.windSpeed, 0.0, 22, 0.01, 3);
  lfo1.frequency.value = lfoFreq;
  lfo2.frequency.value = lfoFreq * -1.278;

  // CLOUD COVER
  // sets LFO Amplitude
  lfoGain1.gain.value = weather.clouds;
  lfoGain2.gain.value = weather.clouds * weather.windSpeed;

  // PAN POSITIONS
  for (let i = 0; i < pans.length; i++){
    pans[i].pan.value = scaleInput(i, 0, pans.length, -1, 1);
  }

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

const loadCharts = function(){

  google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            ['Year', 'Sales', 'Expenses'],
            ['2004',  1000,      400],
            ['2005',  1170,      460],
            ['2006',  660,       1120],
            ['2007',  1030,      540]
          ]);

          var options = {
            title: 'Temp',
            curveType: 'function',
            legend: { position: 'bottom' }
          };

          var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

          chart.draw(data, options);
        }
}


var app = function(){

  initializeCityList();

  const citySelect = document.getElementById('cities-list');
  citySelect.addEventListener('change', getCityWeather);

  loadCharts();

  // const glasgowWeatherURL = "http://api.openweathermap.org/data/2.5/forecast?id=3333231&APPID=d7d64ab41161dd5f312ccbe208418afe";
  // makeRequest(glasgowWeatherURL, getWeatherData);

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
