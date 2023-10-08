// navbar hide on scroll down
const navbar = document.querySelector('.navbar');
let prevScrollPos = window.pageYOffset;
// Set the distance to show the navbar
const showDistance = window.innerHeight;

// back to top button
const button = document.getElementById("back-to-top");
button.classList.add("hidden");


window.addEventListener('scroll', () => {
  const currentScrollPos = window.pageYOffset;
  
  // Check if the user is scrolling up or down
  if (prevScrollPos > currentScrollPos) {
    // If scrolling up, remove the hidden class from the navbar
    navbar.classList.remove('hidden');

  } else {
    // If scrolling down, add the hidden class to the navbar
    navbar.classList.add('hidden');
    
  }
  
  prevScrollPos = currentScrollPos;
  
  // Show navbar when scrolling up to showDistance
  if (currentScrollPos < showDistance && currentScrollPos !== 0) {
    navbar.classList.remove('hidden');
  }
  


  // Show back-to-top button when scrolling down past showDistance
  if (currentScrollPos > showDistance) {
    button.classList.remove("hidden");
  } else {
    button.classList.add("hidden");
  }
});

button.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" 
  }); 
});


// change the color of cursor 
window.onload = function() {
  var mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim().replace('#', '%23');
  var hoverColor = getComputedStyle(document.documentElement).getPropertyValue('--hover-color').trim().replace('#', '%23');

  document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="${mainColor}" /></svg>') 8 8, auto`;

  var links = document.querySelectorAll('a');
  links.forEach(function(link) {
      link.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="${mainColor}" /><circle cx="8" cy="8" r="6" fill="rgba(255, 165, 0, 0.1)" /></svg>') 8 8, auto`;
  });
}