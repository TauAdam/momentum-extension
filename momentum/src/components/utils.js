export const getRandomNum = (min, max) => {
  // inclusive
  return Math.round(Math.random() * (max - min) + min);
};
export const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
