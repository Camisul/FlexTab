//Getitng random background image url
//from list of unsplash collections 
//wiriting it to local storage with timestamp and
//updating it around every 900 seconds (15 minutes)
//and applying it as body background url


const sec = 1000;
const min = 60 * sec;

const API_STRS = [
  'https://source.unsplash.com/collection/540518/',
  'https://source.unsplash.com/collection/463870/',
  'https://source.unsplash.com/collection/1111575/',
  'https://source.unsplash.com/collection/358545/',
  'https://source.unsplash.com/collection/630950/',
  'https://source.unsplash.com/collection/827743/'
]

//redirect: follow is important
//otherwies  we can't get actual image location
//from the unsplash api 
function selectCollection() {
  const selected = API_STRS[Math.floor(Math.random() * API_STRS.length)];
  const {innerHeight, innerWidth} = window;
  return selected + `${innerWidth}x${innerHeight}`;
}

function UpdateBg(){
  return new Promise((resolve, reject) => {
    fetch(selectCollection(), {redirect: 'follow'})
    .then((res) => {
      localStorage.setItem('background', JSON.stringify({
        dt: +new Date(),
        url: res.url,
      }));
      resolve(res.url);
    });
  })
}

function setBg(url) {
  document.body.style.background = `url(${url})`;
}

(() => {
  const bg = JSON.parse(localStorage.getItem('background'));
  if (bg) {
    if(((new Date()) - bg.dt) > 10 * min) UpdateBg().then(setBg);
    setBg(bg.url);
  } else {
    UpdateBg().then(setBg);
  }
})();

document.addEventListener('keydown', (e) => {
  if(e.keyCode === 82 && e.ctrlKey){
    e.preventDefault();
    const cacheUrl = document.body.style.background;
    document.body.style = `
    background: radial-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)),
                ${cacheUrl}; `;
    UpdateBg().then(setBg);
  }
})
/*

            *****************
            *               *
            *      OLD      *
            *               *
            *****************

function UpdateBgi() {
  let API_STR =  + window.innerWidth + 'x' + window.innerHeight;
   fetch(API_STR, {
     redirect: 'follow'
   }).then((res) => {
     let stime = Math.floor(new Date().getTime() / 1000);
     let url = res.url;
     let jobj = {
       stime,
       url
     }
     localStorage.setItem('bg_obj', JSON.stringify(jobj));
   })
 }
 
(function () {

  let bg_str = localStorage.getItem('bg_obj');
  if (bg_str) {
    let bg_obj = JSON.parse(bg_str);
    let utime = Math.floor(new Date().getTime() / 1000);
    if ((utime - bg_obj.stime) >= 900) {
      UpdateBgi();
    }
    setBgi(bg_obj.url);
  } else {
    UpdateBgi();
    bg_str = localStorage.getItem('bg_obj');
    let bg_obj = JSON.parse(bg_str);
    setBgi(bg_obj.url);
  }
})();

//Capturing two key presses of letter R(keycode 82)
//if time delta between two presses is less than 300 ms
//we will update and set current background image
let ts = 1000;
document.addEventListener('keydown', (e) => {
  let ts_delta = Math.floor(e.timeStamp) - ts;
  if (e.keyCode == 82 && ts_delta < 300) {
    UpdateBgi();
    bg_str = localStorage.getItem('bg_obj');
    let bg_obj = JSON.parse(bg_str);
    setBgi(bg_obj.url);
  } else if (e.keyCode == 82) {
    ts = Math.floor(e.timeStamp);
  }
});
*/