var currentSlide = 0;
var slides = document.querySelectorAll(".slide");
var dots = document.querySelectorAll(".dot");

function showSlide(slideIndex) {
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    slides.forEach(function (slide) {
        slide.style.display = "none";
    });

    dots.forEach(function (dot) {
        dot.classList.remove("active");
    });

    slides[slideIndex].style.display = "block";
    dots[slideIndex].classList.add("active");

    currentSlide = slideIndex;
}

function changeSlide(slideIndex) {
    showSlide(slideIndex);
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

showSlide(currentSlide);