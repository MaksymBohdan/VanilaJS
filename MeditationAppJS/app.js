const app = () => {
  const song = document.querySelector('.song');
  const play = document.querySelector('.play');
  const outline = document.querySelector('.moving-outline circle');
  const video = document.querySelector('.vid-container video');

  // Sounds
  const sounds = document.querySelectorAll('.sound-picker button');
  //Time display 
  const timeDisplay = document.querySelector('.time-display');
  const timeSelect = document.querySelectorAll('.time-select button');
  //Get the length of the outline 
  const outlineLength = outline.getTotalLength();
  //Duration
  let fakeDuration = 600;

  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength;

  //pick different sounds
  sounds.forEach(sound => {
    sound.addEventListener('click', function () {
      song.src = sound.getAttribute('data-sound');
      video.src = sound.getAttribute('data-video');
      checkPlaying(song);
    })
    /*or using an arrow function*/
    /*sound.addEventListener('click', () => {
        song.src = sound.getAttribute('data-sound');
        video.src = sound.getAttribute('data-video');
        checkPlaying(song);
    })*/
  })

  //play sound 
  play.addEventListener('click', () => checkPlaying(song));

  //Select time
  timeSelect.forEach(option => {
    option.addEventListener('click', function () {
      fakeDuration = this.getAttribute('data-time');
      let minutes = Math.floor(fakeDuration / 60);
      let seconds = Math.floor(fakeDuration % 60);
      timeDisplay.textContent = `${minutes}:${seconds<10? '0'+ seconds : seconds}`
      song.currentTime = 0;
    })
  })

  //create a function spicific to stop and play the songs 
  const checkPlaying = song => {
    if (song.paused) {
      song.play()
      video.play()
      play.src = './svg/pause.svg';
    } else { 
      song.currentTime = 0;
      song.pause();
      video.pause();
      play.src = './svg/play.svg';
    }
  }

  //we can animate the circle
  song.ontimeupdate = () => {
    let currentTime = song.currentTime;
    let elapsed = fakeDuration - currentTime;
    let seconds = Math.floor(elapsed % 60);
    let minutes = Math.floor(elapsed / 60);

    //animate the circle
    let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    // animate the text 
    timeDisplay.textContent = `${minutes} :${seconds<10? '0'+ seconds : seconds} `

    if (currentTime >= fakeDuration) {
      song.pause();
      song.currentTime = 0;
      play.src = './svg/play.svg';
      video.pause();
    }
  }
}

app()