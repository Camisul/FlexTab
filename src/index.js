//OpenWeatheMap api url & key
const API_KEY = '84d89182eabe041d88c2a0cd0ad03ff6';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const sec = 1000;
const min = 60 * sec;

function $(selector){
  return document.querySelector(selector);
}
/**
 * Get time in format HH:MM and 3 letter day name + DD
 * @returns {Array<string>} [0] -> time [1] -> Day of the week 
 */
function dt(){
  const d = new Date().toString().split(' ');
  const sDayOfTheWeek = `${d[0]} ${d[2]}`.toUpperCase();
  const time = d[4].split(':').slice(0,2).join(':');
  return [time, sDayOfTheWeek];
}

function drawTime(){
  const [time, dayString] = dt();
  $('#clock').innerText = time;
  $('#date').innerText = dayString;
}

function timeLoop() {
  // Look @: https://stackoverflow.com/a/19089196 
  const delay = min - (new Date() % min);
  setTimeout(() => setInterval(drawTime, min), delay);
}

/**
 * Convert object string to query string
 * @returns {string} query string 
 * @param {*} obj 
 */
function obj2QS(obj){
  const queryBody = Object.entries(obj)
  // Urlencoding key and value
  .map(x => x.map(xx => encodeURIComponent(xx)))
  .map(([k,v]) => `${k}=${v}`)
  .join('&');
  return '?' + queryBody;
}
/**
 * @returns {Promise} GeolocationPosition 
 */
const getCurrentPosition = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve);
});

function load() {
  drawTime();  

  getCurrentPosition().then(pos => {
    const {coords: {latitude: lat, longitude: lon}} = pos;
  
    const options = obj2QS({
      lat,
      lon,
      units: 'metric',
      appid: API_KEY,
    });
    
    fetch(API_URL + options)
    .then(res => res.json())
    .then(data => {
      const {main: {temp}, weather: [{main}]} = data;
      $('#forecast').innerText = `${temp}° ${main}`;
    });
  });
  timeLoop();
}

window.onload = load;

/* 

            *****************
            *               *
            *      OLD      *
            *               *
            *****************

// Date and time related stuff

//Shit..
//this is actually a pain in the butt to deal with

//Parsing date as string delimered 
//by spaces and getting short day name
//and actual day number
function getDay() {
  let date = new Date().toString().split(' ');
  return day = (date[0] + ' ' + date[2]).toUpperCase();
}

//Parsing date as string delimered 
//by spaces and getting time string
//then parsing time string and poping
//of seconds and rebuilding time string
function getTime() {
  let date = new Date().toString().split(' ');
  let HoursMinsSecs = date[4].split(':');
  HoursMinsSecs.pop();
  return time = HoursMinsSecs.join(':');
}


window.onload = function () {
  //Geo and forecast related stuff...
  var startPos;
  var geoSuccess = function (position) {
    startPos = position;
    let lat, lon;
    lat = startPos.coords.latitude;
    lon = startPos.coords.longitude;
    
    //Building query sting 
    //for getting forecas in Celsius
    //based on current *gps* position 
  
    querry = `?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    fetch(API_URL + querry).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.json().message);
    }).then((data) => {
      //Just parsing and formating
      //our forecast for display
      forecast = document.querySelector('#forecast');
      temp = Math.floor(data.main.temp);
      forecast.innerText = temp + '° ' + data.weather[0].main;
    });
  }
  navigator.geolocation.getCurrentPosition(geoSuccess);

  //Setting currnet date and time 
  let elTime = document.querySelector('#clock');
  elTime.innerText = getTime();
  let elDate = document.querySelector('#date');
  elDate.innerText = getDay();

  //Keeping time and date on display updated 
  function dd() {
    let update = () => {
      let elTime = document.querySelector('#clock');
      elTime.innerText = getTime();
      if (getTime == '00:00') {
        let elDate = document.querySelector('#date');
        elDate.innerText = getDay();
      }
    }
    update();
    setInterval(update, 60000);
  }
  //Pretty accurate on minute start
  //calculation to lauch presisicon'ish
  //interval for updating date and time
  //More info at:
  //https://stackoverflow.com/a/19089196 
  now = new Date();
  delay = 60000 - (now % 60000);
  setTimeout(dd, delay);
};
*/