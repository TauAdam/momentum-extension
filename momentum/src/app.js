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
// --------------WEATHER-------------------------------------------------
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const feelslike = document.querySelector('.feelslike');
const city = document.querySelector('.city');

const weatherLang = {
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

export async function getWeather() {
  const lang = localStorage.getItem('language');
  const city = localStorage.getItem('city');
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather
	?q=${city}&lang=${lang}&appid=6e4000a6381415cb777aa617f94a608f&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherError.textContent = ``;
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelslike.textContent = `${weatherLang[lang].feelslike} ${Math.round(
      data.main.feels_like
    )}°C`;
    weatherDescription.textContent =
      data.weather[0].description[0].toUpperCase() +
      data.weather[0].description.slice(1);
    wind.textContent = `${weatherLang[lang].wind}: ${Math.round(
      data.wind.speed
    )} ${weatherLang[lang].speed}`;
    humidity.textContent = `${weatherLang[lang].humidity}: ${data.main.humidity}%`;
  } catch {
    weatherError.textContent = weatherLang[lang].error;
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    feelslike.textContent = ``;
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    alert(weatherLang[lang].error);
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
export const getQuotes = async function () {
  const language = localStorage.getItem('language');
  const quotes = `./assets/quotes-${language}.json`;
  const response = await fetch(quotes);
  const data = await response.json();
  let quoteIndex = getRandomNum(0, data.length - 1);
  quote.textContent = data[quoteIndex].quote;
  author.textContent = data[quoteIndex].author;
};

nextQuoteBtn.addEventListener('click', getQuotes);
// --------------AUDIO-------------------------------------------------
import { Background } from './components/background.js';
import { renderTime } from './components/mainPage.js';
import playList from './components/playList.js';
import { Settings, state } from './components/settings.js';

const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playBtn = document.querySelector('.play');
const playerPlaylist = document.querySelector('.play-list');
const audio = new Audio();
let isPlay = false;
let playNum = 0;

// Play or pause the audio when the play button is clicked
const playAudio = () => {
  audio.src = playList[playNum].src;
  setLiStyle();
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

// Play the next song when the next button is clicked
playNext.onclick = () => {
  isPlay = false;
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  playAudio();
  playBtn.classList.add('pause');
};

// Play the previous song when the previous button is clicked
playPrev.onclick = () => {
  isPlay = false;
  playNum = playNum === 0 ? playList.length - 1 : (playNum -= 1);
  playAudio();
  playBtn.classList.add('pause');
};

// Highlight the currently playing song in the playlist
function setLiStyle() {
  const items = document.querySelectorAll('.play-item');
  items.forEach(el => {
    el.classList.remove('item-active');
  });
  items[playNum].classList.toggle('item-active');
}

// Play the next song when the current song ends
audio.addEventListener('ended', () => {
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  isPlay = false;
  playAudio();
  playBtn.classList.add('pause');
});

// Set the title and duration of each song in the playlist
const setSong = (playList, playerPlaylist) => {
  playList.forEach(song => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.innerHTML = `<span class="play-title">${song.title}</span> <span class="play-duration">${song.duration}</span>`;
    playerPlaylist.append(li);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  Background();
  renderTime();
  getWeather(state.currentLang, city.value);
  getQuotes();
  Settings();
  setSong(playList, playerPlaylist);
});
