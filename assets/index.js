
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



//  scrolling projects

var windowWidth = window.innerWidth;

var horLength = document.querySelector(".element-wrapper").scrollWidth;


var distFromTop = document.querySelector(".horizontal-section").offsetTop;


var scrollDistance = distFromTop + horLength - windowWidth;

document.querySelector(".horizontal-section").style.height = horLength + "px";



window.onscroll = function(){
  var scrollTop = window.pageYOffset;
 
  if (scrollTop >= distFromTop && scrollTop <= scrollDistance && windowWidth > 768) {
    
    document.querySelector(".element-wrapper").style.transform = "translateX(-"+(scrollTop - distFromTop)+"px)";
    
  }
  
}


window.addEventListener('resize', function () { 
  "use strict";
  window.location.reload(); 
  console.log("resize");  // test print  if resize function is triggered
});

