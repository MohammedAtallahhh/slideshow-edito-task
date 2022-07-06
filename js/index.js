const slideshow = document.querySelector(".slideshow");
const library = document.querySelector(".library");
const timeline = document.querySelector(".timeline");

const timelineItems = new Array(10).fill(0);

const renderTimeline = () => {
  timelineItems.forEach(
    (item, i) =>
      (timeline.innerHTML += `<div class='timeline-item'>
          ${item === 0 ? i + 1 : `<img src=${item}/>`}  
    </div>`)
  );
};

renderTimeline();
