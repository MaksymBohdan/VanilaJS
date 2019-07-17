//сделать класс Ringer(используя прототипы) который будет воспроизводить аудиофайл, с повторением через заданный интервал в миллисекундах
//options { audio: 'path/to/audio', interval: 1000}
//документацию можно найти тут
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
//создать страничку с 2 инпутами и 2 кнопками start/stop
//в 1 инпут вводим путь к аудио файлу, в 2й инпут вводим интервал через который аудио будет повторяться
// по нажатию на start начинаем воспроизводить аудио/ по stop - останавливаем
// загвоздка в том что audio.play - возвращает промис
// и могут быть ситуации когда в приложении метод stop может быть вызван до того как аудио начнет воспроизводиться, в этом случае мы получим ошибку, но нам так не надо)
// задача написать логику вокруг audio.play/audio.stop таким образом что-бы аудио начинало воспроизводиться и останавливалось без ошибок
const path = document.querySelector('.inp-path');
const interval = document.querySelector('.inp-interval');
const start = document.querySelector('.btn-start');
const stop = document.querySelector('.btn-stop');

function Ringer() {
  this.audio = null;
  this.interval = null;
  this.isMusicOn = false;
  this.intId = null;
}

Ringer.prototype.start = function() {
  if (this.isMusicOn) return;

  this.isMusicOn = true;

  this.audio = new Audio(path.value);
  this.interval = interval.value;

  this.play();

  this.audio.addEventListener('ended', () => {
    this.intId = setTimeout(() => this.play(), this.interval);
  });
};

Ringer.prototype.play = function () {
  this.audio.play().catch(err => console.log(err))
}

Ringer.prototype.stop = function() {
  if (!this.isMusicOn) return;

  clearTimeout(this.intId);
  this.isMusicOn = false;
  this.audio.pause();
};

const ringer = new Ringer({
  audio: null,
  interval: null
});

Ringer.prototype.play = function () {
  this.audio.play().catch(err => console.log(err))
}

start.addEventListener('click', () => {
  if (!interval.value || !path.value) {
    console.log('Fill the input');
    return;
  }

  ringer.start();
});

stop.addEventListener('click', () => {
  ringer.stop();
  console.log('stop');
});

setTimeout(function() {
  ringer.stop();
}, 10000);

// this.intervalId = setInterval(function() {
//   _this.audio.play();
//   console.log('duration', _this.audio.duration);
//   console.log('current time', _this.audio.currentTime);
//   console.log('current time', _this.audio.preload);

//   // _this.audio.delay = 300;
//   // this.audio.play.bind(this)  не могу понять почему не байндится this
// }, this.interval);

// this.audio.addEventListener('timeupdate', () => {
//   if (this.audio.ended) {
//    console.log('end');
//     setTimeout(() => {
//       console.log('aaa');
//       this.audio.play();
//     }, this.interval);
//   }
// });
