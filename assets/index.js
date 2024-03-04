// cursor effect

const cursor = document.getElementById("cursor");
const cursor2 = document.getElementById("cursor2");


const animateCursor = (e, interacting) => {
  const x = e.clientX - cursor.offsetWidth / 2,
        y = e.clientY - cursor.offsetHeight / 2;

  const x2 = e.clientX - cursor2.offsetWidth / 2,
        y2 = e.clientY - cursor2.offsetHeight / 2;
  
  const keyframes = {
    transform: `translate(${x}px, ${y}px) scale(${interacting ? 4 : 1})`
  }
  cursor.style.borderWidth = interacting ? "0.5px" : "1px"; 
  cursor.style.backgroundColor = interacting && e.target.closest('.card') 
  ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)";

  const cursor_dot = document.getElementById("cursor_dot");
  const cursor_text = document.getElementById("cursor_text");
  cursor_dot.style.opacity = interacting ? "0" : "1";
  cursor_text.style.opacity = interacting && e.target.closest('.card') ? "1" : "0";

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

// window.onmousemove = e => {
//   const interacting = e.target.closest('a') !== null;
//   animateCursor(e, interacting);
// }


// <!-- typing animation java -->

const words = ["UX Designer", "UI Designer"];
let cursorIndex = 0;
let wordIndex = 0;

function typeWord(word) {
  
  let typing = setInterval(function() {

    let typed = document.getElementsByClassName("typing-animation")[0];
    
    if (cursorIndex < word.length) {
      typed.innerHTML += word.charAt(cursorIndex);
      cursorIndex++;
    } else {
      clearInterval(typing);
      setTimeout(function() {
        deleteWord(word);
      }, 1000);
    }
  }, 100);
}

function deleteWord(word) {
  let deleting = setInterval(function() {
    let typed = document.getElementsByClassName("typing-animation")[0];
    if (cursorIndex > 0) {
      typed.innerHTML = word.substring(0, cursorIndex - 1);
      cursorIndex--;
    } else {
      clearInterval(deleting);
      cursorIndex = 0;
      wordIndex++;
      if (wordIndex >= words.length) {
        wordIndex = 0;
      }
      typeWord(words[wordIndex]);
    }
  }, 50);
}

typeWord(words[wordIndex]);



// resize page to reload

window.addEventListener('resize', function () { 
  "use strict";
  window.location.reload(); 
  // console.log("resize");  // test print  if resize function is triggered
});







// // change the color of cursor 
// window.onload = function() {
//   var mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim().replace('#', '%23');


//   document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="${mainColor}" /></svg>') 8 8, auto`;

//   var links = document.querySelectorAll('a');
//   links.forEach(function(link) {
//       link.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="${mainColor}" /><circle cx="8" cy="8" r="6" fill="rgba(255, 165, 0, 0.1)" /></svg>') 8 8, auto`;
//   });
// }