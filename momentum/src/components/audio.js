export const setSong = (playList, playerPlaylist) => {
  playList.forEach(song => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = song.title;
    playerPlaylist.append(li);
  });
};
