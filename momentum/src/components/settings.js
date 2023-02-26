import { getQuotes, getWeather } from '../app.js';
import { createImageUrl } from './background.js';
import { renderTime } from './mainPage.js';
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
    changeLang: 'Select your language',
    showHideBlocks: 'Show/Hide Blocks',
    gallery: 'Gallery',
    searchPlaceholder: 'Search high-resolution images',
    checkboxes: {
      time: 'Time',
      date: 'Date',
      greeting: 'Greeting',
      quote: 'Quote',
      weather: 'Weather',
      player: 'Audio Player',
      todoList: 'To-Do List',
    },
  },
  ru: {
    changeLang: 'Выберите ваш язык',
    showHideBlocks: 'Показать/скрыть блоки',
    gallery: 'Галерея',
    searchPlaceholder: 'Поиск изображений высокого разрешения',
    checkboxes: {
      time: 'Время',
      date: 'Дата',
      greeting: 'Приветствие',
      quote: 'Цитата',
      weather: 'Погода',
      player: 'Аудиоплеер',
      todoList: 'Список дел',
    },
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

languageRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    state.currentLang = radio.value;
    localStorage.setItem('language', state.currentLang);
    updateUI(language[state.currentLang]);
  });
});
const translateCheckboxes = lang => {
  blocks.forEach(el => {
    el.nextElementSibling.textContent = lang.checkboxes[el.value];
  });
};
const updateUI = language => {
  getWeather();
  getQuotes();
  renderTime();

  translateCheckboxes(language);
  const changeLangEl = document.querySelector('.language-switcher p');
  const galleryEl = document.querySelector('.gallery');
  const searchInputEl = document.querySelector('.tag-input');
  const showHideBlocks = document.querySelector('.show-hide');

  changeLangEl.textContent = language.changeLang;
  showHideBlocks.textContent = language.showHideBlocks;
  galleryEl.textContent = language.gallery;
  searchInputEl.placeholder = language.searchPlaceholder;
};

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
