console.log('js started');

import { createAnimatable, utils } from 'https://esm.sh/animejs';

const hero = document.querySelector('.hero');
const heroText = document.querySelector('.hero-text'); 

let bounds = hero.getBoundingClientRect();
const refreshBounds = () => (bounds = hero.getBoundingClientRect());

// small movement amount (pixels)
const maxMove = 5;

// Animatable: x/y here act like "default duration" for those properties (ms) :contentReference[oaicite:1]{index=1}
const animatableHero = createAnimatable(heroText, {
  x: 500,
  y: 300,
  ease: 'out(3)',
});

const onMouseMove = (e) => {
  const { width, height, left, top } = bounds;
  const hw = width / 2;
  const hh = height / 2;

  // delta from center of hero 
  const dx = e.clientX - left - hw;
  const dy = e.clientY - top - hh;

  // clamp to hero bounds 
  const clampedX = utils.clamp(dx, -hw, hw);
  const clampedY = utils.clamp(dy, -hh, hh);

  // convert from [-hw..hw] => [-1..1] then scale to a few pixels
  const x = (clampedX / hw) * maxMove;
  const y = (clampedY / hh) * maxMove;

  animatableHero.x(x + 200);
  animatableHero.y(y);
};

const reset = () => {
  animatableHero.x(0);
  animatableHero.y(0);
};

// track mouse movement inside of hero
hero.addEventListener('mousemove', onMouseMove);
hero.addEventListener('mouseleave', reset);

// keeps bounds accurate to hero container
window.addEventListener('resize', refreshBounds);
window.addEventListener('scroll', refreshBounds, { passive: true });

var lineDrawing = anime({
  targets: '#lineDrawing .lines path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 5000,
  delay: 1000,
  direction: 'alternate',
  loop: true
});

var timeOut;

class Item {
    constructor(icon, backgroundColor) {
        this.$element = $(document.createElement("div"));
        this.icon = icon;
        this.$element.addClass("item");
        this.$element.css("background-color", backgroundColor);
        var i = document.createElement("i");
        $(i).addClass("fi-" + icon);
        this.$element.append(i);
        this.prev = null;
        this.next = null;
        this.isMoving = false;
        var element = this;
        this.$element.on("mousemove", function() {
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                if (element.next && element.isMoving) {
                    element.next.moveTo(element);
                } 
            }, 10);
        });
    }
    
    moveTo(item) {
        anime({
            targets: this.$element[0],
            left: item.$element.css("left"),
            top: item.$element.css("top"),
            duration: 700,
            elasticity: 500
        });
        if (this.next) {
            this.next.moveTo(item);
        }
    }

    updatePosition() {    
        anime({
            targets: this.$element[0],
            left: this.prev.$element.css("left"),
            top: this.prev.$element.css("top"),
            duration: 80
        });
        
        if (this.next) {
            this.next.updatePosition();
        }
    }
}

class Menu {
    constructor(menu) {
        this.$element = $(menu);
        this.size = 0;
        this.first = null;
        this.last = null;
        this.timeOut = null;
        this.hasMoved = false;
        this.status = "closed";
    }
    
    add(item) {
        var menu = this;
        if (this.first == null) {
            this.first = item;
            this.last = item;
            this.first.$element.on("mouseup", function() {
                if (menu.first.isMoving) {
                    menu.first.isMoving = false;        
                } else {
                    menu.click();
                }
            }); 
            // jQuery UI expects a _single_ options object; earlier versions mistakenly
            // passed three separate objects which meant drag/stop handlers were ignored.
            item.$element.draggable({
                start: function() {
                    menu.close();
                    item.isMoving = true;
                },
                drag: function() {
                    if (item.next) {
                        item.next.updatePosition();
                    }
                },
                stop: function() {
                    item.isMoving = false;
                    if (item.next) item.next.moveTo(item);
                }
            });
        } else {
            this.last.next = item;
            item.prev = this.last;
            this.last = item;
        }
        this.$element.after(item.$element);
        
        
    }
    
    open() {
        // always expand the chain to the right of the head item
        this.status = "open";
        var current = this.first.next;
        var iterator = 1;
        var head = this.first;
        var baseLeft = parseInt(head.$element.css("left"), 10);
        var baseTop = head.$element.css("top");
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: baseLeft + iterator * 50,
                top: baseTop,
                duration: 500
            });
            iterator++;
            current = current.next;
        }
    }
    
    close() {
        this.status = "closed";
        var current = this.first.next;
        var head = this.first;
        var iterator = 1;
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: head.$element.css("left"),
                top: head.$element.css("top"),
                duration: 500
            });
            iterator++;
            current = current.next;
        }
    }
    
    click() {
        if (this.status == "closed") {
            this.open();
        } else {
            this.close();
        }
    }
    
}

var menu = new Menu("#myMenu");
var item1 = new Item("list");
var item2 = new Item("torso", "#FF5C5C");
var item3 = new Item("social-facebook", "#5CD1FF");
var item4 = new Item("paypal", "#FFF15C");
var item5 = new Item("link", "#64F592");

menu.add(item1);
menu.add(item2);
menu.add(item3);
menu.add(item4);
menu.add(item5);
$(document).delay(50).queue(function(next) {
    menu.open();
    next();
    $(document).delay(1000).queue(function(next) {
        menu.close();
        next();
    });
});