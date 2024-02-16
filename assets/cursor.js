const cursor = document.getElementById("cursor");
const cursor2 = document.getElementById("cursor2");


const animateCursor = (e, interacting) => {
  const x = e.clientX - cursor.offsetWidth / 2,
        y = e.clientY - cursor.offsetHeight / 2;

  const x2 = e.clientX - cursor2.offsetWidth / 2,
        y2 = e.clientY - cursor2.offsetHeight / 2;
  
  // keyframes for cursor , keyframes for cursor2
  const keyframes = {
    transform: `translate(${x}px, ${y}px) scale(${(e.target.closest('.button') ? 0.9 : interacting ? 4 : 1)})`
  };

  cursor.style.borderWidth = interacting ? "0.5px" : "1px"; 
  cursor.style.backgroundColor = interacting && e.target.closest('.project') 
  ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)";

  const cursor_dot = document.getElementById("cursor_dot");
  const cursor_text = document.getElementById("cursor_text");
  cursor_dot.style.opacity = interacting && !e.target.closest('.button') ? "0" : "1";
  cursor_text.style.opacity = interacting && e.target.closest('.project') ? "1" : "0";

  const keyframes2 = 
  { transform: `translate(${x2}px, ${y2}px)` };

  cursor.animate(keyframes, { 
    duration: 800, 
    fill: "forwards" 
  });



  cursor2.animate(keyframes2, { 
    duration:100, 
    fill: "forwards" 
  });
}

// /   -----------------------------
// check device with mouse 

const cursorElement = document.getElementById('cursor');
const cursor2Element = document.getElementById('cursor2');


function handleMouseMove(event) {
  const interacting = event.target.closest('a') !== null;
  animateCursor(event, interacting);
}

function handlePointerFineChange(event) {
  const cursorElements = [cursorElement, cursor2Element];
  
  if (event.matches) {
    cursorElements.forEach(element => {
      element.style.opacity = '1';
    });
    window.addEventListener('mousemove', handleMouseMove);
  } else {
    cursorElements.forEach(element => {
      element.style.opacity = '0';
    });
    window.removeEventListener('mousemove', handleMouseMove);
  }
}

const pointerFineMediaQuery = window.matchMedia('(any-pointer:fine)');
pointerFineMediaQuery.addEventListener('change', handlePointerFineChange);
handlePointerFineChange(pointerFineMediaQuery);