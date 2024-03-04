// Go to top button
let goTopBtn = document.getElementById("goTopBtn");
window.onscroll = function () {
scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        goTopBtn.style.display = "block";
    } else {
        goTopBtn.style.display = "none";
    }
}


