import { getRandomNum } from './components/utils.js';
// --------------GREETING-------------------------------------------------

const name = document.querySelector('.name');

window.addEventListener('beforeunload', () => {
  localStorage.setItem('name', name.value);
});

window.addEventListener('load', () => {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
});
// --------------SLIDER-------------------------------------------------
Background();
// --------------WEATHER-------------------------------------------------
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const feelslike = document.querySelector('.feelslike');
const city = document.querySelector('.city');

const template = {
  en: {
    error: 'ERROR. Please enter valid city!',
    humidity: 'Humidity',
    wind: 'Wind speed',
    feelslike: 'Feels like',
    speed: 'm/s', 
  },
  ru: {
    error: 'ОШИБКА. Пожалуйста, введите действительный город!',
    speed: 'м/с',
    wind: 'Скорость ветра',
    feelslike: 'Как будто',
    humidity: 'Влажность',
  },
};

async function getWeather(lang, city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather
	?q=${city}&lang=${lang}&appid=6e4000a6381415cb777aa617f94a608f&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherError.textContent = ``;
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelslike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    weatherDescription.textContent =
      data.weather[0].description[0].toUpperCase() +
      data.weather[0].description.slice(1);
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
  } catch {
    weatherError.textContent = template[lang].error;
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    feelslike.textContent = ``;
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    alert(`Error 404: city not found => Please enter valid city!`);
  }
}

city.addEventListener('keypress', event => {
  if (event.code === 'Enter') {
    getWeather('en', city.value);
    city.blur();
  }
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('city', city.value);
});
window.addEventListener('load', () => {
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
});
// --------------QUOTES-------------------------------------------------
const quote = document.querySelector('.quote-text');
const author = document.querySelector('.author');
const nextQuoteBtn = document.querySelector('.change-quote');
const getQuotes = async function () {
  let quoteIndex = getRandomNum(0, 101);
  const quotes = './components/quotes.json';
  const response = await fetch(quotes);
  const data = await response.json();
  quote.textContent = data[quoteIndex].quote;
  author.textContent = data[quoteIndex].author;
};

nextQuoteBtn.addEventListener('click', getQuotes);
// --------------AUDIO-------------------------------------------------
import { setSong } from './components/audio.js';
import { Background } from './components/background.js';
import { renderTime } from './components/mainPage.js';
import playList from './components/playList.js';
import { Settings, state } from './components/settings.js';

const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playBtn = document.querySelector('.play');
const playerPlaylist = document.querySelector('.play-list');
let isPlay = false;
let playNum = 0;
const audio = new Audio();

const playAudio = () => {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (isPlay === false) {
    audio.play();
    playBtn.classList.toggle('pause');
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
    playBtn.classList.toggle('pause');
  }
};
playBtn.onclick = playAudio;
playNext.onclick = () => {
  isPlay = false;
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  playAudio();
  playBtn.classList.add('pause');
};
playPrev.onclick = () => {
  isPlay = false;
  playNum = playNum === 0 ? playList.length - 1 : (playNum -= 1);
  playAudio();
  playBtn.classList.add('pause');
};

setSong(playList, playerPlaylist);
function setLiStyle() {
  const items = document.querySelectorAll('.play-item');
  console.log(items);
  items.forEach((el, i) => {
    if (el.classList.contains('item-active')) {
      el.classList.remove('item-active');
    }
    el[playNum].classList.add('item-active');
  });
}
audio.addEventListener('ended', () => {
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  isPlay = false;
  playAudio();
  playBtn.classList.add('pause');
});

document.addEventListener('DOMContentLoaded', () => {
  renderTime();
  getWeather(state.currentLang, city.value);
  getQuotes();
  Settings();
});
