import { getTimeOfDay } from './mainPage.js';
import { state } from './settings.js';
import { getRandomNum } from './utils.js';

async function setUnsplashImage(query) {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${query}&client_id=EYGGj9W5IVW5Aybe1gXq1iBzDifIxNI-ART73mnLY-U`;
  const res = await fetch(url);
  const data = await res.json();
  try {
    return data.urls.regular;
  } catch (err) {
    console.log(err);
  }
}
const setFlickrImage = async tag => {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=0f15ff623f1198a1f7f52550f8c36057&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.photos.photo[getRandomNum(0, data.photos.perpage)].url_l;
  } catch (err) {
    console.log(err);
  }
};
const setBg = url => {
  const img = new Image();
  const handleLoad = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
  const handleError = () => {
    console.error('Error loading image:', img.src);
  };
  img.src = url;
  img.addEventListener('load', handleLoad);
  img.addEventListener('error', handleError);
};

let randomNum = getRandomNum(1, 20);

export const createImageUrl = async () => {
  const timeOfDay = getTimeOfDay();
  let bgUrl;
  if (state.photoSource === 'unsplash') {
    const tag = localStorage.getItem('query') || 'nature';
    bgUrl = await setUnsplashImage(tag);
  } else if (state.photoSource === 'flickr') {
    const tag = localStorage.getItem('query') || 'nature';
    bgUrl = await setFlickrImage(tag);
  } else {
    const bgNum = randomNum.toString().padStart(2, '0');
    bgUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  }
  setBg(bgUrl);
};

const getSlideNext = () => {
  randomNum = randomNum < 20 ? (randomNum += 1) : 1;
  createImageUrl();
};
const getSlidePrev = () => {
  randomNum = randomNum > 1 ? (randomNum -= 1) : 20;
  createImageUrl();
};
export const Background = () => {
  const slidePrev = document.querySelector('.slide-prev'),
    slideNext = document.querySelector('.slide-next');
  slideNext.addEventListener('click', getSlideNext);
  slidePrev.addEventListener('click', getSlidePrev);
};
