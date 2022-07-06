const slideshow = document.querySelector(".slideshow");
const library = document.querySelector(".library");
const timeline = document.querySelector(".timeline");

const slideshowWrapper = slideshow.querySelector(".swiper-wrapper");
const timelineItemsElement = timeline.querySelector(".timeline-items");
const playButton = slideshow.querySelector(".play");
const stopButton = slideshow.querySelector(".stop");
const transitionForm = timeline.querySelector(".timeline-transition");

let swiper;

//------------------- TIMELINE
const timelineItems = new Array(10).fill(0);
timelineItems[2] = "images/1.jpg";
let timelineTransition = "slide";

const renderTimeline = () => {
  timelineItems.forEach(
    (item, i) =>
      (timelineItemsElement.innerHTML += `<div class='timeline-item'>
          ${item === 0 ? i + 1 : `<img src=${item} />`}  
    </div>`)
  );
};

const makeSlider = () => {
  // If there is a slider, make sure to destroy it
  // along with the old events attached with it
  if (swiper) {
    playButton.removeEventListener("click", swiper.autoplay.start);
    stopButton.removeEventListener("click", swiper.autoplay.stop);
    swiper.destroy();
  }

  swiper = new Swiper(".swiper", {
    effect: timelineTransition,
    spaceBetween: 50,
    speed: 500,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },

    coverflowEffect: {
      rotate: 60,
      slideShadows: true,
    },

    fadeEffect: {
      crossFade: true,
    },
  });

  swiper.autoplay.stop();
  swiper.disable();

  // Adding events to control playing and stopping slideshow
  playButton.addEventListener("click", () => {
    swiper.autoplay.start();
    swiper.enable();
  });
  stopButton.addEventListener("click", () => {
    swiper.autoplay.stop();
    swiper.disable();
  });

  // Stop slideshow in the end
  swiper.on("slideChange", function () {
    if (swiper.isEnd) {
      swiper.autoplay.stop();
    }
  });
};

const handleTransitionChange = (e) => {
  if (e.target.closest(".type")) {
    const newActive = e.target.closest(".type");
    const oldActive = transitionForm.querySelector(".type.active");

    oldActive.classList.remove("active");
    newActive.classList.add("active");
    timelineTransition = newActive.querySelector("input").name;
    makeSlider();
  }
};

const renderSlideShow = () => {
  timelineItems.forEach(
    (slide, i) =>
      (slideshowWrapper.innerHTML += `
    <div class='swiper-slide'>
      ${
        slide === 0
          ? `<div class='blank-slide'>Slide ${i + 1}`
          : `<img src=${slide} />`
      }
    </div>
  `)
  );
};

transitionForm.addEventListener("click", handleTransitionChange);
//--------------------------- SLIDESHOW

renderTimeline();
renderSlideShow();
makeSlider();
