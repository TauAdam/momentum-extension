export const getRandomNum = (min, max) => {
  // inclusive
  return Math.round(Math.random() * (max - min) + min);
};
