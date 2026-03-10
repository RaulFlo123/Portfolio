// script.js
import { createAnimatable, utils } from 'https://esm.sh/animejs';

// HERO CURSOR ANIMATION
const hero = document.querySelector('.hero');
const heroText = document.querySelector('.hero-text');
let bounds = hero.getBoundingClientRect();
const refreshBounds = () => (bounds = hero.getBoundingClientRect());
const maxMove = 5;
// Create an Animatable instance for the hero text (from Anime.js docs)【25†L454-L463】.
const animatableHero = createAnimatable(heroText, {
  x: 500,
  y: 300,
  ease: 'out(3)'
});

// On mouse move, animate heroText x/y relative to center (clamped)【25†L467-L471】.
const onMouseMove = (e) => {
  const { width, height, left, top } = bounds;
  const hw = width / 2, hh = height / 2;
  // Calculate offset from hero center
  const dx = e.clientX - left - hw;
  const dy = e.clientY - top - hh;
  // Clamp values to keep within bounds
  const clampedX = utils.clamp(dx, -hw, hw);
  const clampedY = utils.clamp(dy, -hh, hh);
  // Scale to a small movement
  const x = (clampedX / hw) * maxMove;
  const y = (clampedY / hh) * maxMove;
  // Animate to new x,y (duration set by default in createAnimatable)【25†L454-L463】
  animatableHero.x(x + 200);
  animatableHero.y(y);
};
const reset = () => { animatableHero.x(0); animatableHero.y(0); };
hero.addEventListener('mousemove', onMouseMove);
hero.addEventListener('mouseleave', reset);
window.addEventListener('resize', refreshBounds);
window.addEventListener('scroll', refreshBounds, { passive: true });

// SVG LINE DRAWING ANIMATION
anime({
  targets: '#lineDrawing .lines path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 5000,
  delay: 1000,
  direction: 'alternate',
  loop: true
});

// MENU ITEM AND MENU CLASSES (from jQueryScript plugin)
// Each Item is a draggable icon circle that passes motion to the next item【9†L96-L105】.
class Item {
  constructor(icon, backgroundColor) {
    this.$element = $(document.createElement("div"));
    this.$element.addClass("item");
    if (backgroundColor) this.$element.css("background-color", backgroundColor);
    const iTag = document.createElement("i");
    $(iTag).addClass("fi-" + icon);
    this.$element.append(iTag);
    this.prev = null;
    this.next = null;
    this.isMoving = false;
    // When this item moves, schedule the next item to catch up【9†L108-L116】.
    this.$element.on("mousemove", () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        if (this.next && this.isMoving) this.next.moveTo(this);
      }, 10);
    });
  }
  // Move this item to the position of another item (anime.js for smooth motion)【9†L119-L127】.
  moveTo(item) {
    anime({
      targets: this.$element[0],
      left: item.$element.css("left"),
      top: item.$element.css("top"),
      duration: 700,
      elasticity: 500
    });
    if (this.next) this.next.moveTo(item);
  }
  updatePosition() {
    anime({
      targets: this.$element[0],
      left: this.prev.$element.css("left"),
      top: this.prev.$element.css("top"),
      duration: 80
    });
    if (this.next) this.next.updatePosition();
  }
}

class Menu {
  constructor(menu) {
    this.$element = $(menu);
    this.first = null; this.last = null;
    this.status = "closed";
  }
  add(item) {
    if (!this.first) {
      this.first = this.last = item;
      // Clicking the first item toggles the menu (vs dragging)【9†L146-L155】.
      this.first.$element.on("mouseup", () => {
        if (this.first.isMoving) {
          this.first.isMoving = false;
        } else {
          this.click();
        }
      });
      // Make the first item draggable (jQuery UI)【23†L147-L151】.
      item.$element.draggable({
        start: () => { this.close(); item.isMoving = true; },
        drag: () => { if (item.next) item.next.updatePosition(); },
        stop: () => { item.isMoving = false; if (item.next) item.next.moveTo(item); }
      });
    } else {
      this.last.next = item;
      item.prev = this.last;
      this.last = item;
    }
    this.$element.after(item.$element);
  }
  open() {
    this.status = "open";
    let current = this.first.next, i = 1;
    const head = this.first;
    const baseLeft = parseInt(head.$element.css("left"), 10);
    const baseTop = head.$element.css("top");
    // Spread items horizontally by 50px increments【10†L199-L208】.
    while (current) {
      anime({
        targets: current.$element[0],
        left: baseLeft + (i * 50),
        top: baseTop,
        duration: 500
      });
      i++; current = current.next;
    }
  }
  close() {
    this.status = "closed";
    let current = this.first.next, head = this.first;
    // Collapse items back to the head position【10†L219-L227】.
    while (current) {
      anime({
        targets: current.$element[0],
        left: head.$element.css("left"),
        top: head.$element.css("top"),
        duration: 500
      });
      current = current.next;
    }
  }
  click() { (this.status == "closed" ? this.open() : this.close()); }
}

let timeOut;
const menu = new Menu("#myMenu");
const item1 = new Item("list");     // Using Foundation icons (fi-list)
const item2 = new Item("torso", "#FF5C5C");
const item3 = new Item("social-facebook", "#5CD1FF");
const item4 = new Item("paypal", "#FFF15C");
const item5 = new Item("link", "#64F592");
menu.add(item1);
menu.add(item2);
menu.add(item3);
menu.add(item4);
menu.add(item5);
// Auto-open then close the menu for demo effect
$(document).delay(50).queue((next) => { menu.open(); next();
  $(document).delay(1000).queue((next) => { menu.close(); next(); });
});
