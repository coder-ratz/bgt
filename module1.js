/* Init all touch events */
function startup() {
    const el = document.getElementById('mycanvas');
    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('touchcancel', handleCancel);
    el.addEventListener('touchmove', handleMove);
    window.addEventListener('resize', resizeCanvas, false);
   
    render = anime({
        duration: Infinity,
        update: canvasUpdate
    });
      
    // Fill vars with content
    canvasEl = document.getElementById('mycanvas');
    ctx = canvasEl.getContext('2d');

    // Init canvases
    //ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);  
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    backCanvas = document.createElement('canvas');
    backCanvas.width = canvasEl.width;
    backCanvas.height = canvasEl.height;
    
    var backCtx = backCanvas.getContext('2d');
    backCtx.drawImage(canvasEl, 0, 0);
    
    /*
    // TODO: need update for touchstart not click
    var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';

    document.addEventListener(tap, function(e) {
        // window.human = true;
        var backCtx = backCanvas.getContext('2d');
        backCtx.drawImage(canvasEl, 0, 0);
        render.play();
        // TODO: need update for touchstart not click
        //updateCoords(e);
        var playerId = Math.floor(Math.random() * 6);
        animateParticules(e.clientX, e.clientY, playerId);
    }, false);
    */

    resizeCanvas();
    main_initPlayers();
    initTimer(false);

    initCanvas();

    log('Initialized.');
}


/* Log function */
function log(msg) {
    const container = document.getElementById('log');
    container.textContent = `${msg} \n${container.textContent}`;
}


function canvasUpdate() {
    // TODO: Replace by new function to copy canvas to another one instead clearing
    //ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);  
    ctx.shadowBlur = 0;
    ctx.drawImage(backCanvas, 0, 0);
}


function renderParticule(anim) {
    //ctx.drawImage(backCanvas, 0, 0);
    for (var i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.draw();
    }
  }

  
function setParticuleDirection(p) {
    var angle = anime.random(0, 360) * Math.PI / 180;
    var value = anime.random(120, 360);
    var radius = [-1, 1][anime.random(0, 1)] * value;
    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle)
    }
  }
  

function createParticule(x, y, playerId) {
    var p = {};
    var opacity = Math.floor((Math.random() * 80) + (255 - 80)); 

    p.x = x;
    p.y = y;
    
    p.color = `rgba(${main_playerColorOnly(playerId)}, ${opacity})`;
    // p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function() {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    return p;
}


function animateParticules(x, y, playerId) {
    var particules = [];

    for (var i = 0; i < numberOfParticules; i++) {
      particules.push(createParticule(x, y, playerId));
    }
    anime.timeline().add({
      targets: particules,
      x: function(p) { return p.endPos.x; },
      y: function(p) { return p.endPos.y; },
      radius: 0.1,
      duration: anime.random(3000, 5000),
      easing: 'easeOutExpo',
      update: renderParticule
    });
  }


/* Helper functions */

/* Init timer. Start with flag=true, stop with flag=false */
function initTimer(flag) {
    if (flag) {
        /* Start timer */
        timer = setInterval(timerEvent, TIMESLICE);
        time = 0;
        log('Timer started.');
        timerEvent();
    } else {
        /* Stop timer */
        clearTimeout(timer);
        log('Timer stopped.');
    }
}


function redraw() {
    return;
}


/* Resize Canvas to max. size */
function resizeCanvas() {
    const el = document.getElementById('mycanvas');
    
    /* Use complete width */
    el.width = el.clientWidth;
    
    /* Use remaining height including a margin to the edge */
    el.height = document.documentElement.clientHeight - el.getBoundingClientRect().top - 5;
    backCanvas.width = el.width;
    backCanvas.height = el.height;

    BASERADIUS = Math.min(el.width, el.height) / 10;
    redraw();
}


/* Update progress bar */
function updateProgressBar(time) {
    const ratio = time / TIMING * 100;
    document.getElementById('progressBar').setAttribute('style', 'width: ' + ratio + '%');
}


/* Update graphics */
function updateGraphics(time) {
    const el = document.getElementById('mycanvas');
    const ctx = el.getContext('2d');

    let x, y, color, r, a, d;

    if (touched) {
        for (let i = 0; i < ongoingTouches.length; i++) {
            /* Get current player data */
            x = xCoord(ongoingTouches[i], el);
            y = yCoord(ongoingTouches[i], el);
            color = main_playerColorOpacity(i);

            r = Math.random() * BASERADIUS * 2;     /* radius r of sprinkle */
            a = Math.random() * 2 * Math.PI;        /* angle a of sprinkle */
            d = (1 + 0.8 * (Math.random() - 0.5) + time/ TIMING ) * BASERADIUS / 16;

            x = x + Math.floor(r * Math.sin(a));
            y = y + Math.floor(r * Math.cos(a));
            
            ctx.save();
            ctx.fillStyle = color;
            /* ctx.fillStyle = 'white'; */
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.shadowBlur = BASERADIUS / 8;
            ctx.shadowColor = "lightgrey";
            ctx.arc(x, y, d, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
}



/* Create test content on canvas */
function initCanvas() {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    
    for (var i = 0; i < 8; i++) {
        var x = Math.floor(Math.random() * 400);
        var y = Math.floor(Math.random() * 400);
        var color = main_playerColor(Math.floor(Math.random() * 6));
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 2 * BASERADIUS;
        // ctx.shadowBlur = 0;
        ctx.shadowColor = "lightgrey";
        ctx.beginPath();
        ctx.arc(x, y, 2 * BASERADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        //ctx.shadowBlur = 0;
    }
    
    ctx.restore();
}


function simulateWinner() {
    
    const x = Math.floor(Math.random() * backCanvas.width);
    const y = Math.floor(Math.random() * backCanvas.height);
    // const color = main_playerColor(i);

    var backCtx = backCanvas.getContext('2d');
    backCtx.drawImage(canvasEl, 0, 0);
    render.play();
    animateParticules(x, y, Math.floor(Math.random()*4));
 
}



/* Show winner */
function showWinner(i) {
    /* Get current player data */
    const x = xCoord(ongoingTouches[i], el);
    const y = yCoord(ongoingTouches[i], el);
    // const color = main_playerColor(i);

    var backCtx = backCanvas.getContext('2d');
    backCtx.drawImage(canvasEl, 0, 0);
    render.play();
    animateParticules(x, y, i);

    /*
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.shadowBlur = 2 * BASERADIUS;
    ctx.shadowColor = "lightgrey";
    ctx.beginPath();
    ctx.arc(x, y, 2 * BASERADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    */
}


/* Regular timer event, ran every TIMESLICE */
function timerEvent() {
    time += TIMESLICE;
    const container = document.getElementById('timer');

    if (time <= TIMING) {
        /* Timing step */
        container.textContent = `${time}`;

        /* Update progress bar */
        updateProgressBar(time);

        /* Update graphics */
        updateGraphics(time);
    } else {
        /* End of timer reached */
        container.textContent = `end of time.`;
        initTimer(false);

        let iWinner = main_winner(ongoingTouches.length);
        console.log(`Player ${iWinner} wins with color ${main_playerColor(iWinner)})`);
        showWinner(iWinner);

        touched = false; /* set back screen next touch */
    }
    return;
}


/* Start drawing on canvas */
function drawStart(x, y, playerId) {
    const el = document.getElementById('mycanvas');
    const ctx = el.getContext('2d');
    const color = main_playerColorOpacity(playerId);

    log(`width = ${el.width}, height = ${el.height}, x = ${x}, y = ${y}`);

    updateGraphics(0);
}


/* Continue drawing on canvas */
function drawCont(x, y, playerId) {
    drawStart(x, y, playerId);
    return;
}


function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY };
}


function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;

        if (id === idToFind) {
        return i;
        }
    }
    return -1;    // not found
}


/* Recalculate coordinates to canvas */
function xCoord(event, el) {
    var global = event.clientX;
    var offset = el.getBoundingClientRect().left;
    return (global - offset);
}


function yCoord(event, el) {
    var global = event.clientY;
    var offset = el.getBoundingClientRect().top;
    return (global - offset);
}


/* Handle start */
function handleStart(evt) {
    evt.preventDefault();
    log('touchstart.');
    if (!touched) {
        touched = true;
        main_initPlayers();
        resizeCanvas();
    }
    const el = document.getElementById('mycanvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        log(`touchstart: ${i}.`);
        ongoingTouches.push(copyTouch(touches[i]));
        /* Color depending on touch no */
        let playerId = touches[i].identifier;

        /*
        log(`color of touch with id ${touches[i].identifier} = ${color}`);
        */

        /* Init timer */
        initTimer(false);
        initTimer(true);

        /* Start drawing */
        drawStart(xCoord(touches[i], el), yCoord(touches[i], el), playerId);
    }
}


/* Handle end */
function handleEnd(evt) {
    evt.preventDefault();
    log("touchend");
    touched = false; /* set back screen next touch */
    const el = document.getElementById('mycanvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
        ongoingTouches.splice(idx, 1);  // remove it; we're done
        initTimer(false);
        } else {
        log('can\'t figure out which touch to end');
        }
    }
}


/* Handle cancel */
function handleCancel(evt) {
    evt.preventDefault();
    log('touchcancel.');
    touched = false; /* set back screen next touch */
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        initTimer();
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}


/* Handle move */
function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementById('mycanvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        const playerId = touches[i].identifier;
        const idx = ongoingTouchIndexById(playerId);

        if (idx >= 0) {
            /*
            log(`continuing touch ${idx}`);
            */

            drawCont(xCoord(touches[i], el), yCoord(touches[i], el), playerId);

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            } else {
            log('can\'t figure out which touch to continue');
        }
    }
}


/* --- Main --- */
const TIMESLICE = 25;   /* frequency of timer events in ms */
const TIMING = 3000;    /* total time in ms */

let BASERADIUS = 40;    /* base radius */

let timer;              /* global timer element */
let time = 0;           /* global time counter in ms */
let touched = false;    /* start in untouched mode */

document.addEventListener("DOMContentLoaded", startup);
const ongoingTouches = [];

/* from firework.js 
Source:
    CodePen Home
    Anime.js Fireworks canvas demo
    Julian Garnier
*/
var backCanvas;
var canvasEl;
var ctx;
var numberOfParticules = 50;
var pointerX = 0;
var pointerY = 0;
var tap;

var render;

