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


