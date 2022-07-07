const slideshow = document.querySelector(".slideshow");
const library = document.querySelector(".library");
const timeline = document.querySelector(".timeline");

const slideshowWrapper = slideshow.querySelector(".swiper-wrapper");
const timelineItemsElement = timeline.querySelector(".timeline-items");
const libraryItemsElement = library.querySelector(".library-items");
const playButton = slideshow.querySelector(".play");
const stopButton = slideshow.querySelector(".stop");
const transitionForm = timeline.querySelector(".timeline-transition");

let swiper;

let libraryImages = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
];
const timelineItems = new Array(10).fill(0);
let timelineTransition = "slide";

//------------------ FUNCTIONS
const getNameFromSrc = (src) => src.split("/")[1].split(".")[0];
const render = () => {
  renderLibrary();
  renderTimeline();
  renderSlideShow();
  makeSlider();
};

const renderTimeline = () => {
  timelineItemsElement.innerHTML = "";
  timelineItems.forEach(
    (item, i) =>
      (timelineItemsElement.innerHTML += `
      <div class='timeline-item drop-target' data-index='${i}' draggable>
          ${item === 0 ? i + 1 : `<img src=${item} alt="nature" />`}
      </div>`)
  );
};

const deleteItemFromTimeline = (e) => {
  e.preventDefault();
  if (e.target.closest(".timeline-item")) {
    const item = e.target.closest(".timeline-item");
    const itemIndex = item.dataset.index;

    // Making sure that we are not deleting an empty cell
    if (timelineItems[itemIndex] !== 0) {
      const src = item.firstElementChild.attributes.src.value;
      const imgName = getNameFromSrc(src);
      libraryImages.unshift(imgName);
      timelineItems[itemIndex] = 0;
      render();
    }
  }
};

const renderLibrary = () => {
  libraryItemsElement.innerHTML = "";
  libraryImages.forEach(
    (item) =>
      (libraryItemsElement.innerHTML += `
    <div class="library-item" draggable>
      <img src='images/${item}.jpg' alt="nature" />
    </div>
  `)
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

  // Stopping the slider to control it manually
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

const renderSlideShow = () => {
  slideshowWrapper.innerHTML = "";
  timelineItems.forEach(
    (slide, i) =>
      (slideshowWrapper.innerHTML += `
    <div class='swiper-slide'>
    ${
      slide === 0
        ? `<div class='blank-slide'>Slide ${i + 1}`
        : `<img src=${slide} alt="nature slide" />`
    }
    </div>
    `)
  );
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

const handleDragStart = (e) => {
  swiper.slideTo(0);
  swiper.autoplay.stop();

  if (!e.target.closest("[draggable]")) return;

  timeline.classList.add("active-dragging");

  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      src: e.target.attributes.src.value,
      target: e.target.parentElement.dataset.index,
      isTimelineElement: !!e.target.closest(".timeline-item"),
    })
  );
};

const handleDragEnd = (e) => {
  timeline.classList.remove("active-dragging");
};

const handleDrop = (e) => {
  // If it's not droppable do nothing
  if (!e.target.closest(".drop-target")) return;
  e.preventDefault();

  // getting data from the dragged content
  const data = JSON.parse(e.dataTransfer.getData("text/plain"));
  const imgName = getNameFromSrc(data.src);
  const currentImgIndex = +e.target.closest(".drop-target").dataset.index;

  // If we are dragging from the timeline we need to delete the old cell
  if (data.isTimelineElement) {
    timelineItems[data.target] = timelineItems[currentImgIndex];
  } else {
    libraryImages = libraryImages.filter((img) => img !== imgName);
  }

  timelineItems[currentImgIndex] = data.src;
  render();
  timeline.classList.remove("active-dragging");
};
// render for the first time
render();

//------------------------- EVENTS
timeline.addEventListener("contextmenu", deleteItemFromTimeline);
transitionForm.addEventListener("click", handleTransitionChange);
document.body.addEventListener("dragstart", handleDragStart);
document.body.addEventListener("dragend", handleDragEnd);
document.body.addEventListener("dragover", (e) => e.preventDefault());

document.body.addEventListener("drop", handleDrop);
