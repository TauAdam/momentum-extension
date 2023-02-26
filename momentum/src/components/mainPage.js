export const getTimeOfDay = () => {
  const lang = localStorage.getItem('language') || 'en';
  const date = new Date();
  const hours = date.getHours();
  const arr =
    lang == 'en'
      ? ['morning', 'afternoon', 'evening', 'night']
      : ['утро', 'день', 'вечер', 'ночь'];
  const timeOfDay = arr[Math.floor((hours % 24) / 6)];
  return timeOfDay;
};

const greetingLang = {
  en: {
    good: 'Good',
    placeholder: '[Enter name]',
  },
  ru: {
    good: 'Добрый',
    placeholder: '[Введите имя]',
  },
};

const showGreeting = span => {
  const lang = localStorage.getItem('language');

  const greetingText = `${greetingLang[lang].good} ${getTimeOfDay()}, `;
  span.textContent = greetingText;
  document.querySelector('.name').placeholder = greetingLang[lang].placeholder;
};

const getDateTime = () => {
  const lang = localStorage.getItem('language');
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const currentDate = now.toLocaleDateString(`${lang}-US`, options);
  const currentTime = now.toLocaleTimeString();
  return { currentDate, currentTime };
};
export const renderTime = ({ currentDate, currentTime } = getDateTime()) => {
  const time = document.querySelector('.time');
  const date = document.querySelector('.date');
  const greeting = document.querySelector('.greeting-text');
  date.textContent = currentDate;
  time.textContent = currentTime;
  showGreeting(greeting);
  setTimeout(renderTime, 1000);
};
//! One function - one task
