// --------------TIME-------------------------------------------------
const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
function showTime() {
	const now = new Date();
	const currentTime = now.toLocaleTimeString();
	time.textContent = currentTime;
	showDate(date);
	showGreeting(greeting);
	setTimeout(showTime, 1000);
}
showTime();
//! One function - one task
function showDate(date) {
	const now = new Date();
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	};
	const currentDate = now.toLocaleDateString('en-US', options);
	date.textContent = currentDate;
}
// --------------GREETING-------------------------------------------------
function getTimeofDay() {
	const date = new Date();
	const hours = date.getHours();
	const arr = ['morning', 'afternoon', 'evening', 'night'];
	const timeofDay = arr[Math.floor(hours / 6) - 1];
	return timeofDay;
}
function showGreeting(span) {
	const greetingText = `Good ${getTimeofDay()}, `;
	span.textContent = greetingText;
}

const name = document.querySelector('.name');
function setLocalStorage() {
	localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
	if (localStorage.getItem('name')) {
		name.value = localStorage.getItem('name');
	}
}
window.addEventListener('load', getLocalStorage);
// --------------SLIDER-------------------------------------------------
function getRandomNum(min, max) { // iclusive
	return Math.round(Math.random() * (max - min) + min);
}
let randomNum = getRandomNum(1, 20);

function setBg() {
	const timeOfDay = getTimeofDay();
	const bgNum = randomNum.toString().padStart(2, '0');
	const img = new Image();
	img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
	img.onload = () => { document.body.style.backgroundImage = `url(${img.src})`; };
}
setBg();
function getSlideNext() {
	randomNum = randomNum < 20 ? randomNum += 1 : 1;
	setBg();
}
function getSlidePrev() {
	randomNum = randomNum > 1 ? randomNum -= 1 : 20;
	setBg();
}
const slidePrev = document.querySelector('.slide-prev'), slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);
// --------------WEATHER-------------------------------------------------
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const feelslike = document.querySelector('.feelslike');
const city = document.querySelector('.city');
city.value = 'Minsk';

async function getWeather() {
	try {
		const url = `https://api.openweathermap.org/data/2.5/weather
	?q=${city.value}&lang=en&appid=6e4000a6381415cb777aa617f94a608f&units=metric`;
		const res = await fetch(url);
		const data = await res.json();
		weatherError.textContent = ``;
		weatherIcon.className = 'weather-icon owf';
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${Math.round(data.main.temp)}°C`;
		feelslike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
		weatherDescription.textContent = (data.weather[0].description)[0].toUpperCase() + (data.weather[0].description).slice(1);
		wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
		humidity.textContent = `Humidity: ${data.main.humidity}%`;
	} catch {
		weatherError.textContent = `ERROR. Please enter valid city!`;
		weatherIcon.className = 'weather-icon owf';
		temperature.textContent = '';
		feelslike.textContent = ``;
		weatherDescription.textContent = '';
		wind.textContent = '';
		humidity.textContent = '';
		alert(`Error 404: city not found => Please enter valid city!`);
	}
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', (event) => {
	if (event.code === 'Enter') {
		getWeather();
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
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const nextQuoteBtn = document.querySelector('.change-quote');
function getQuotes() {
	let quoteIndex = getRandomNum(0, 101);
	const quotes = 'js/quotes.json';
	fetch(quotes)
		.then(res => res.json())
		.then(data => {
			quote.textContent = data[quoteIndex].quote;
			author.textContent = data[quoteIndex].author;
		});
}
getQuotes();
nextQuoteBtn.addEventListener('click', getQuotes);
// --------------AUDIO-------------------------------------------------
import playList from './playList.js';

const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playBtn = document.querySelector('.play');
const playerPlaylist = document.querySelector('.play-list');
let isPlay = false;
let playNum = 0;
const audio = new Audio();

playBtn.onclick = playAudio;
function playAudio() {
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
}
playNext.onclick = () => {
	isPlay = false;
	playNum = playNum === playList.length - 1 ? 0 : playNum += 1;
	playAudio();
	playBtn.classList.add('pause');
};
playPrev.onclick = () => {
	isPlay = false;
	playNum = playNum === 0 ? playList.length - 1 : playNum -= 1;
	playAudio();
	playBtn.classList.add('pause');
};
function setSong() {
	playList.forEach((song) => {
		const li = document.createElement('li');
		li.classList.add('play-item');
		li.textContent = song.title;
		playerPlaylist.append(li);
	});
}
setSong();
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
audio.addEventListener("ended", () => {
	playNum = playNum === playList.length - 1 ? 0 : playNum += 1;
	isPlay = false;
	playAudio();
	playBtn.classList.add('pause');
});
