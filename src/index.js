//OpenWeatheMap api url & key
API_KEY = ''; //api key goes here
API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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

