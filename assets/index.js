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
  cursor.style.backgroundColor = interacting && e.target.closest('.project') 
  ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)";

  const cursor_dot = document.getElementById("cursor_dot");
  const cursor_text = document.getElementById("cursor_text");
  cursor_dot.style.opacity = interacting ? "0" : "1";
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



// window.onmousemove = e => {
//   const interacting = e.target.closest('a') !== null;
//   animateCursor(e, interacting);
// }

function handleMouseMove(e) {
  const interacting = e.target.closest('a') !== null;
  animateCursor(e, interacting);
}

// Check for touch support initially
const hasTouch = 'ontouchstart' in window;

// Adapt approach based on detected touch support
if (hasTouch) {
  // Touch device: Add and remove event listener on touch events
  window.addEventListener('touchstart', () => {
    window.removeEventListener('mousemove', handleMouseMove);
  });
  // window.addEventListener('touchend', () => {
  //   window.addEventListener('mousemove', handleMouseMove);
  // });
} else {
  // Non-touch device: Attach the event listener immediately
  window.addEventListener('mousemove', handleMouseMove);
}


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





// 3d hover effect          from codepen

// /* Store the element in el */    class returns an array of elements
let el = document.getElementsByClassName('logo')[0] 

/* Get the height and width of the element */
const height = el.clientHeight
const width = el.clientWidth


/*
  * Add a listener for mousemove event
  * Which will trigger function 'handleMove'
  * On mousemove
  */
el.addEventListener('mousemove', handleMove)

/* Define function a */
function handleMove(e) {
  /*
    * Get position of mouse cursor
    * With respect to the element
    * On mouseover
    */
  /* Store the x position */
  const xVal = e.layerX
  /* Store the y position */
  const yVal = e.layerY
  

  /*
    * Calculate rotation valuee along the Y-axis
    * Here the multiplier 20 is to
    * Control the rotation
    * You can change the value and see the results
    */
  const yRotation = 5 * ((xVal - width / 5) / width)
  
  /* Calculate the rotation along the X-axis */
  const xRotation = -5 * ((yVal - height / 5) / height)
  
  /* Generate string for CSS transform property */
  const string = 'perspective(500px)  rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'
  
  /* Apply the calculated transformation */
  el.style.transform = string
}

/* Add listener for mouseout event, remove the rotation */
el.addEventListener('mouseout', function() {
  el.style.transform = 'perspective(500px)  rotateX(0) rotateY(0)'
})

/* Add listener for mousedown event, to simulate click */
el.addEventListener('mousedown', function() {
  el.style.transform = 'perspective(500px)  rotateX(0) rotateY(0)'
})

/* Add listener for mouseup, simulate release of mouse click */
el.addEventListener('mouseup', function() {
  el.style.transform = 'perspective(500px)  rotateX(0) rotateY(0)'
})


// // change the color of cursor 
// window.onload = function() {
//   var mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim().replace('#', '%23');


//   document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="${mainColor}" /></svg>') 8 8, auto`;

//   var links = document.querySelectorAll('a');
//   links.forEach(function(link) {
//       link.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="${mainColor}" /><circle cx="8" cy="8" r="6" fill="rgba(255, 165, 0, 0.1)" /></svg>') 8 8, auto`;
//   });
// }