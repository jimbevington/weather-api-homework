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

}


var app = function(){

  const glasgowWeatherURL = "http://api.openweathermap.org/data/2.5/forecast?id=3333231&APPID=d7d64ab41161dd5f312ccbe208418afe";
  makeRequest(glasgowWeatherURL, getWeatherData);

}

window.addEventListener('load', app);
