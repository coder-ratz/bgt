/*Basic color definition in RGB */
let COLORS = [
    {name:"red", r:"255", g:"0", b:"0"},
    {name:"green", r:"0", g:"255", b:"0"},
    {name:"yellow", r:"255", g:"255", b:"0"},
    {name:"blue", r:"0", g:"0", b:"255"},
    {name:"cyan", r:"0", g:"255", b:"255"},
    {name:"magenta", r:"255", g:"0", b:"255"},
];
/* Opacity */
const OPACITY = 0.3;


/* Shuffle Colors */
function main_initPlayers() {
    let temp = {};
    let source = 0;
    let target = 0;
    /* Swap colors 3 times */
    for (let i = 0; i < (3 * COLORS.length); i++) {
        source = Math.floor(Math.random() * COLORS.length);
        target = Math.floor(Math.random() * COLORS.length);
        temp = COLORS[target];
        COLORS[target] = COLORS[source];
        COLORS[source] = temp;
    }
    return;
}


/* Returns player color without opacity */
function main_playerColorOnly(i) {
    /* White by default */
    let r = 255;
    let g = 255;
    let b = 255;
    if (i < COLORS.length) {
        /* Get table values */
        r = COLORS[i].r;
        g = COLORS[i].g;
        b = COLORS[i].b;
    }
    return `${r}, ${g}, ${b}`;
}


/* Returns player color including opacity */
function main_playerColor(i) {
    return `rgb(${main_playerColorOnly(i)})`;
}


/* Returns player color including opacity */
function main_playerColorOpacity(i) {
    return `rgba(${main_playerColorOnly(i)}, ${OPACITY})`;
}


/* Determine winner randomly */
function main_winner(i) {
    return Math.floor(Math.random() * i);
}
