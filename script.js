// script.js
// Raul Flores Portfolio Animations


/*
Anime.js Documentation
Citation:
https://animejs.com/documentation/

Used for:
- text animations
- parallax movement
- svg drawing animations
- scroll reveal effects
*/


console.log("Portfolio Loaded");


/* ================================
HERO PARALLAX ANIMATION
================================ */

const hero = document.querySelector('.hero');
const heroText = document.querySelector('.hero-text');

if (hero && heroText) {

    let bounds = hero.getBoundingClientRect();

    const refreshBounds = () => bounds = hero.getBoundingClientRect();

    const maxMove = 8;

    /*
    createAnimatable()
    Citation:
    https://animejs.com/documentation/animatables/
    */

    const animatableHero = anime({
        targets: heroText,
        translateX: 0,
        translateY: 0,
        duration: 400,
        easing: "easeOutQuad",
        autoplay: false
    });

    hero.addEventListener("mousemove", (e) => {

        const { width, height, left, top } = bounds;

        const hw = width / 2;
        const hh = height / 2;

        const dx = e.clientX - left - hw;
        const dy = e.clientY - top - hh;

        const x = (dx / hw) * maxMove;
        const y = (dy / hh) * maxMove;

        anime({
            targets: heroText,
            translateX: x,
            translateY: y,
            duration: 400,
            easing: "easeOutQuad"
        });

    });

    hero.addEventListener("mouseleave", () => {

        anime({
            targets: heroText,
            translateX: 0,
            translateY: 0,
            duration: 500
        })

    })

    window.addEventListener("resize", refreshBounds)

}


/* ================================
SVG LINE DRAWING
================================ */

/*
Line drawing technique
Citation:
https://animejs.com/documentation/#strokedashoffset
*/

if (document.querySelector("#lineDrawing")) {

    anime({
        targets: '#lineDrawing .lines path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 5000,
        delay: 500,
        direction: 'alternate',
        loop: true
    })

}


/* ================================
LETTER BY LETTER TITLE ANIMATION
================================ */

/*
Letter splitting technique
Citation:
https://animejs.com/documentation/#timeline
*/

const textWrapper = document.querySelector('.letters');

if (textWrapper) {

    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({ loop: false })

        .add({

            targets: '.letter',

            translateY: [80, 0],
            opacity: [0, 1],

            easing: "easeOutExpo",

            duration: 1500,

            delay: (el, i) => 40 * i

        })

}


/* ================================
PROJECT CARD HOVER ANIMATION
================================ */

/*
Hover transform technique
Citation:
https://developer.mozilla.org/en-US/docs/Web/CSS/transform
*/

const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        anime({
            targets: card,
            scale: 1.05,
            translateY: -10,
            duration: 300,
            easing: "easeOutQuad"
        })

    })

    card.addEventListener("mouseleave", () => {

        anime({
            targets: card,
            scale: 1,
            translateY: 0,
            duration: 300,
            easing: "easeOutQuad"
        })

    })

});


/* ================================
SCROLL REVEAL ANIMATION
================================ */

/*
IntersectionObserver API
Citation:
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
*/

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            anime({
                targets: entry.target,
                translateY: [40, 0],
                opacity: [0, 1],
                duration: 800,
                easing: "easeOutExpo"
            })

        }

    })

})

document.querySelectorAll(".project-card").forEach(card => {
    card.style.opacity = 0;
    observer.observe(card)
})


/* ================================
FLOATING PARTICLE BACKGROUND
================================ */

/*
Particle animation idea
Inspired by modern developer portfolios
Citation:
https://animejs.com/documentation/#animation
*/

const particleContainer = document.getElementById("particles");

if (particleContainer) {

    for (let i = 0; i < 30; i++) {

        const dot = document.createElement("div");

        dot.style.width = "6px";
        dot.style.height = "6px";
        dot.style.background = "cyan";
        dot.style.borderRadius = "50%";
        dot.style.position = "absolute";

        dot.style.top = Math.random() * 100 + "%";
        dot.style.left = Math.random() * 100 + "%";

        particleContainer.appendChild(dot);

        anime({

            targets: dot,

            translateY: [
                { value: -120, duration: 4000 },
                { value: 0, duration: 4000 }
            ],

            opacity: [
                { value: 0.2 },
                { value: 1 },
                { value: 0.2 }
            ],

            loop: true,
            direction: "alternate",
            easing: "easeInOutSine",
            delay: Math.random() * 2000

        })

    }

}
/*
Anime.js Stagger Animation
Citation:
https://animejs.com/documentation/#stagger
*/

document.addEventListener("DOMContentLoaded", function () {

    const eggBtn = document.getElementById("eggButton");
    const eggPopup = document.getElementById("eggPopup");

    if (eggBtn) {

        eggBtn.addEventListener("click", function () {

            anime({
                targets: "#eggPopup",
                bottom: 120,
                duration: 800,
                easing: "easeOutExpo"
            });

        });

    }

});

/*
Anime.js Glow Pulse
Citation:
https://animejs.com/documentation/#animation
*/

if (document.querySelector(".contact-glow")) {

    anime({

        targets: ".contact-glow",

        boxShadow: [
            "0 0 15px rgba(0,255,255,0.2)",
            "0 0 40px rgba(0,255,255,0.6)"
        ],

        direction: "alternate",

        loop: true,

        easing: "easeInOutSine",

        duration: 2000

    })

}
/*
Easter Egg Popup Animation
Uses Anime.js to slide message up from bottom woah cool right!!!! btw this is a secret message for anyone who finds it, so shhhhhh hi r
*/

const egg = document.getElementById("easterEgg");

if (egg) {

    setTimeout(() => {

        anime({

            targets: "#easterEgg",

            bottom: 20,

            duration: 1000,

            easing: "easeOutExpo"

        })

    }, 4000);

}

/*
Anime.js popup animation
Citation:
https://animejs.com/documentation/#animation
*/

const eggBtn = document.getElementById("eggButton");
const eggPopup = document.getElementById("eggPopup");

if (eggBtn) {

    eggBtn.addEventListener("click", () => {

        anime({

            targets: "#eggPopup",

            bottom: 120,

            duration: 800,

            easing: "easeOutExpo"

        });

    });

}
