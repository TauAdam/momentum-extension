import { formatTime, getRandomNum } from './components/utils.js';
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
const cityInput = document.querySelector('.city');

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
  const lang = localStorage.getItem('language') || 'en';
  const city = localStorage.getItem('city') || 'Minsk';
  cityInput.value = city;

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
  }
}

cityInput.addEventListener('keypress', event => {
  if (event.code === 'Enter') {
    localStorage.setItem('city', cityInput.value);
    getWeather();
    cityInput.blur();
  }
});

// --------------QUOTES-------------------------------------------------
const quote = document.querySelector('.quote-text');
const author = document.querySelector('.author');
const nextQuoteBtn = document.querySelector('.change-quote');
export const getQuotes = async function () {
  const language = localStorage.getItem('language') || 'en';
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
import { Settings } from './components/settings.js';

const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playPauseButton = document.querySelector('.play');
const playerPlaylist = document.querySelector('.play-list');
const audioPlayer = document.querySelector('.player');
const trackName = audioPlayer.querySelector('.track-name');
const currentTimeElement = audioPlayer.querySelector('.current-time');
const totalTime = audioPlayer.querySelector('.total-time');
const soundToggle = audioPlayer.querySelector('.sound-toggle');
const volumeSlider = audioPlayer.querySelector('.volume-slider');
const progressBar = audioPlayer.querySelector('.progress-bar');
const progressSlider = audioPlayer.querySelector('.progress');

const audio = new Audio();
let isPlay = false;
let playNum = 0;

let currentTrackTime = 0;
let totalTrackTime = 0;

const playAudio = () => {
  audio.src = playList[playNum].src;
  trackName.textContent = playList[playNum].title;
  totalTime.textContent = playList[playNum].duration;
  setLiStyle();
  audio.currentTime = currentTrackTime;
  if (isPlay === false) {
    audio.addEventListener('canplaythrough', () => {
      audio.play();
      totalTrackTime = audio.duration;
      totalTime.textContent = formatTime(totalTrackTime);
    });

    playPauseButton.classList.toggle('pause');
    isPlay = true;
  } else {
    audio.addEventListener('canplaythrough', () => {
      audio.pause();
    });
    isPlay = false;
    playPauseButton.classList.toggle('pause');
  }
};

playPauseButton.onclick = playAudio;

playNext.onclick = () => {
  isPlay = false;
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  currentTrackTime = 0;
  playAudio();
  playPauseButton.classList.add('pause');
};

playPrev.onclick = () => {
  isPlay = false;
  playNum = playNum === 0 ? playList.length - 1 : (playNum -= 1);
  currentTrackTime = 0;
  playAudio();
  playPauseButton.classList.add('pause');
};

function setLiStyle() {
  const items = document.querySelectorAll('.play-item');
  items.forEach(el => {
    el.classList.remove('item-active');
  });
  items[playNum].classList.toggle('item-active');
}

audio.addEventListener('ended', () => {
  playNum = playNum === playList.length - 1 ? 0 : (playNum += 1);
  isPlay = false;
  currentTrackTime = 0;

  playAudio();
  playPauseButton.classList.add('pause');
});

audio.addEventListener('timeupdate', () => {
  currentTrackTime = audio.currentTime;
  currentTimeElement.textContent = formatTime(currentTrackTime);
  progressSlider.value = (currentTrackTime / totalTrackTime) * 100;
});

progressSlider.addEventListener('input', () => {
  const newCurrentTime = (progressSlider.value / 100) * totalTrackTime;
  audio.currentTime = newCurrentTime;
  currentTrackTime = newCurrentTime;
  currentTimeElement.textContent = formatTime(currentTrackTime);
  // progressSlider.style.width = `${(currentTrackTime / totalTrackTime) * 100}%`;
});

soundToggle.onclick = () => {
  if (audio.muted === true) {
    audio.muted = false;
    soundToggle.textContent = 'Mute';
  } else {
    audio.muted = true;
    soundToggle.textContent = 'Unmute';
  }
};
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});
const setSong = (playList, playerPlaylist) => {
  playList.forEach((song, index) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.innerHTML = `<span class="play-title">${song.title}</span>`;
    li.addEventListener('click', () => {
      if (playNum === index) {
        playAudio();
      } else {
        currentTrackTime = 0;
        isPlay = false;
        playNum = index;
        playPauseButton.classList.remove('pause');
        playAudio();
      }
    });
    playerPlaylist.append(li);
  });
};
// setSong(playList, playerPlaylist);
// progressBar.addEventListener('click', event => {
//   const progressBarRect = progressBar.getBoundingClientRect();
//   const clickX = event.clientX - progressBarRect.left;
//   const progressBarWidth = progressBar.offsetWidth;
//   const newCurrentTime = (clickX / progressBarWidth) * audioPlayer.duration;
//   audio.currentTime = newCurrentTime;
//   updateCurrentTimeUI();
// });

// function updateCurrentTimeUI() {
//   currentTrackTime = audio.currentTime;
//   currentTimeElement.textContent = formatTime(currentTrackTime);
// }

document.addEventListener('DOMContentLoaded', () => {
  Background();
  getWeather();
  getQuotes();
  Settings();
  setSong(playList, playerPlaylist);
  renderTime();
});
