# BOARD GAME TOOLS
#### URL:
https://ralftischer.github.io/bgt/index.html
#### Making Of Video:
https://youtu.be/31NmYvYz69s
#### Description:
*Board Game Tools* is a collection of different modules to support board game players utilizing html, js and css. It was created by Ralf Tischer, Wuppertal, Germany in late 2022 for the Harvard CS50 course.

*Draw Start PLayer* is the first module implemented to randomly draw a start player from a number of players: When playing analogue board games, it is ususlly required to agree on the start player. To support this, module 1 of the collection is started: All players touch the on a canvas of a touchscreen device, each touch is represented by sprinkles in a dedicated randomly drawn color. A countdown timer is started with the last touch represented by a progress bar. During the countdown, little sprinkles in player color are added around the touch position of each player. If a touch is cancelled, the countdown is aborted. At the end of the countdown, one player is randomly selected as start player and displayed with a big circle in player color on his/ her touch position. A new touch restarts the timer after end or abortion.
The application has no control elements except the players' touchs on the screen.

**Homepage:**
- `index.html`: Homepage for the site.
- `about.html`: About page.
- `style.css`: CSS sheet valid for all pages. Main defintions:
    -   `.mainnav`: responsive navigation bar
    -   `.canvas`: canvas
- `main.js`: Basic JavaScript functions withou reference to html elements. Defines an array with basic colors.

**Module 1: Draw Start Player**
- `module1.html`: html for the page mainly consisting a canvas for catching touch events. Each player puts a finger on the touchscreen, a countdown in started and at the end the winner in awarded visually.
- `module1.js`: JavaScript referring to `module1.html`. Main elements:
    - `el`: mycanvas
    - `function startup()`: init function.
    - `function resizeCanvas()`: fills canvas to max. size.
    - `function updateProgressBar()`: updates progress bar.
    - `function updateGraphics()`: updates graphics with little random sprinkles around a defined radius.
    - `function fadeOut(x, y, width, height, ctx)`: fade out area around the position of the winner touch.
    - `function showWinner()`: display winner in correct color on correct position.
    - `function timerEvent()`: triggered from timer element.
    - `function drawStart()`: starts to draw when a touchstart event.
    - `function drawCont()`: continues to draw when a touchstart event.
    - `function hadleStart()`: handles touchstart event.
    - `function hadleEnd()`: handles touchend event.
    - `function hadleCancel()`: handles touchcancel event.
    - `function hadleMove()`: handles touchmove event.
    - `TIMESLICE`: frequency of timer events in ms.
    - `TIMING`: total time in ms.
    - `BASERADIUS`: base radius for grahisc in pixel, calculed during `resizeCanvas()`.

