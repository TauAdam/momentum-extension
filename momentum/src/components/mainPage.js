export const getTimeOfDay = () => {
  const date = new Date();
  const hours = date.getHours();
  const arr = ['morning', 'afternoon', 'evening', 'night'];
  const timeofDay = arr[Math.floor(hours / 6) - 1];
  return timeofDay;
};

const showGreeting = span => {
  const greetingText = `Good ${getTimeOfDay()}, `;
  span.textContent = greetingText;
};

const getDateTime = () => {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const currentDate = now.toLocaleDateString('en-US', options);
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
