import { createImageUrl } from './background.js';
import { TodoList } from './todoList.js';

TodoList();

const button = document.querySelector('.open-settings-btn');
const popup = document.querySelector('.popup');
export const Settings = () => {
  button.addEventListener('click', () => {
    popup.classList.toggle('active');
  });
};

export const state = {
  currentLang: localStorage.getItem('language') || 'en',
  photoSource: localStorage.getItem('photoSource') || 'github',
  photoTag: localStorage.getItem('query') || 'nature',
};

const toggleBlockVisibility = (blockClass, hide) => {
  const block = document.querySelector(`.${blockClass}`);
  if (hide) {
    block.style.opacity = 0;
  } else {
    block.style.opacity = 1;
  }
};

const blocks = document.querySelectorAll(
  'input[type="checkbox"][name="blocks"]'
);
const settings = {
  time: true,
  date: true,
  greeting: true,
  quote: true,
  weather: true,
  player: true,
  todoList: true,
};
blocks.forEach(checkbox => {
  checkbox.addEventListener('change', _ => {
    settings[checkbox.value] = checkbox.checked;
    toggleBlockVisibility(checkbox.value, !settings[checkbox.value]);
    localStorage.setItem('settings', JSON.stringify(settings));
  });
});

const language = {
  en: {
    greeting: 'Good morning',

    quoteAuthor: 'Author unknown',
    settings: 'Settings',
    gallery: 'Gallery',

    searchPlaceholder: 'Search high-resolution images',
    quoteOfTheDay: 'Quote of the day',
    weather: 'Weather',
  },
  ru: {
    greeting: 'Доброе утро',

    quoteAuthor: 'Автор неизвестен',
    settings: 'Настройки',

    searchPlaceholder: 'Поиск изображений высокого разрешения',
    quoteOfTheDay: 'Цитата дня',
    weather: 'Погода',
  },
};

const languageRadios = document.querySelectorAll(
  'input[type="radio"][name="language"]'
);

// Set the checked attribute of the selected radio button based on the state.language
languageRadios.forEach(radio => {
  if (radio.value === state.currentLang) {
    radio.checked = true;
  }
});

// Add a change event listener to the languageRadios to update the selected language and store it in localStorage
languageRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    state.currentLang = radio.value;
    localStorage.setItem('language', state.currentLang);
    // Call a function to update the UI with the new language
    updateUI(language[state.currentLang]);
  });
});
// Function to update the UI with the selected language
// function updateUI(language) {
//   const greetingEl = document.querySelector('.greeting');
//   const settingsEl = document.querySelector('.settings');
//   const galleryEl = document.querySelector('.gallery p');

//   const searchInputEl = document.querySelector('.tag-input');
//   const quoteOfTheDayEl = document.querySelector('.quote-of-the-day');

//   greetingEl.textContent = language.greeting;


//   settingsEl.textContent = language.settings;
//   galleryEl.textContent = language.gallery;
//   searchInputEl.placeholder = language.searchPlaceholder;
//   quoteOfTheDayEl.textContent = language.quoteOfTheDay;
//   // weatherDescriptionEl.textContent = state
// }

const sourceRadios = document.querySelectorAll(
  'input[type="radio"][name="source"]'
);

window.addEventListener('beforeunload', _ => {
  // Save all checkbox states to localStorage
  localStorage.setItem('settings', JSON.stringify(settings));
});

window.addEventListener('DOMContentLoaded', () => {
  const savedSettings = JSON.parse(localStorage.getItem('settings'));
  if (savedSettings) {
    blocks.forEach(el => {
      const isChecked = savedSettings[el.value];
      el.checked = isChecked;
      toggleBlockVisibility(el.value, !isChecked);
    });
  }

  createImageUrl();
  sourceRadios.forEach(radio => {
    if (radio.value === state.photoSource) {
      radio.checked = true;
    }
  });

  tagInput.style.opacity = state.photoSource !== 'github' ? 1 : 0;
  if (state.photoTag === 'nature') {
    tagInput.value = '';
  } else {
    tagInput.value = state.photoTag;
  }
});

const tagInput = document.querySelector('.tag-input');
sourceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    tagInput.style.opacity = radio.value !== 'github' ? 1 : 0;
    state.photoSource = radio.value;
    localStorage.setItem('photoSource', state.photoSource);
    createImageUrl();
  });
});
tagInput.addEventListener('change', () => {
  localStorage.setItem('query', tagInput.value);
  createImageUrl();
});
