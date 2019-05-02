const slides = document.querySelectorAll('.slide');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev')
const auto = true;
const intervalTime = 4000;
let slideInteraval;

const nextSlide = () => {
  const current = document.querySelector('.current');
  //  remove current class
  current.classList.remove('current');
  //check for next slide
  if (current.nextElementSibling) {
    //Add current to next sibling 
    current.nextElementSibling.classList.add('current');
  } else {
    //add curret to start
    slides[0].classList.add('current');
  }
}

const prevSlide = () => {
  const current = document.querySelector('.current');
  //  remove current class
  current.classList.remove('current');
  //check for prev slide
  if (current.previousElementSibling) {
    //Add current to prev sibling 
    current.previousElementSibling.classList.add('current');
  } else {
    //add curret to start
    slides[slides.length-1].classList.add('current');
  }
}

// button events 
next.addEventListener('click', e => {
  nextSlide();
  //to clear interval
  if(auto) {
    clearInterval(slideInteraval);
    slideInteraval = setInterval(nextSlide, intervalTime)
  }
})

prev.addEventListener('click', e => {
  prevSlide();
  if(auto) {
    clearInterval(slideInteraval);
    slideInteraval = setInterval(prevSlide, intervalTime)
  }
})

//Auto slide
if(auto){
  //run net slide in interval time 
  slideInteraval = setInterval(nextSlide, intervalTime)
}