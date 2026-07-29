/* ================================= */
/* RETRO CRT / VHS EFFECT            */
/* ================================= */

const retroCanvas = document.querySelector("#retro");

const retroContext = retroCanvas.getContext("2d");

let retroWidth = 0;
let retroHeight = 0;

/* ================================= */
/* RESIZE                            */
/* ================================= */

function resizeRetro() {
    retroWidth = retroCanvas.width = window.innerWidth;

    retroHeight = retroCanvas.height = window.innerHeight;
}

resizeRetro();

window.addEventListener("resize", resizeRetro);

/* ================================= */
/* RANDOM                            */
/* ================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* ================================= */
/* SCANLINES                         */
/* ================================= */

function drawScanlines() {
    retroContext.fillStyle = "rgba(0, 0, 0, 0.12)";

    for (let y = 0; y < retroHeight; y += 4) {
        retroContext.fillRect(0, y, retroWidth, 1);
    }
}

/* ================================= */
/* MOVING VHS TRACK                  */
/* ================================= */

let trackPosition = 0;

function drawTracking() {
    trackPosition += 1.2;

    if (trackPosition > retroHeight + 100) {
        trackPosition = -100;
    }

    /*
        Main tracking line
    */

    retroContext.fillStyle = "rgba(255,255,255,0.035)";

    retroContext.fillRect(0, trackPosition, retroWidth, 40);

    /*
        Dark edge
    */

    retroContext.fillStyle = "rgba(0,0,0,0.08)";

    retroContext.fillRect(0, trackPosition + 40, retroWidth, 8);
}

/* ================================= */
/* VHS GLITCH                        */
/* ================================= */

function drawGlitch() {
    /*
        Only occasionally
    */

    if (Math.random() > 0.965) {
        const y = random(0, retroHeight);

        const height = random(2, 15);

        const offset = random(-40, 40);

        /*
            White tracking
        */

        retroContext.fillStyle = "rgba(255,255,255,0.08)";

        retroContext.fillRect(offset, y, retroWidth, height);

        /*
            RGB separation
        */

        retroContext.fillStyle = "rgba(255,0,0,0.04)";

        retroContext.fillRect(offset - 8, y, retroWidth, height);

        retroContext.fillStyle = "rgba(0,80,255,0.04)";

        retroContext.fillRect(offset + 8, y, retroWidth, height);
    }
}

/* ================================= */
/* RANDOM RGB LINES                  */
/* ================================= */

function drawRGBLines() {
    if (Math.random() > 0.9) {
        const y = random(0, retroHeight);

        const height = random(1, 3);

        /*
            RED
        */

        retroContext.fillStyle = "rgba(255,0,0,0.04)";

        retroContext.fillRect(-10, y, retroWidth, height);

        /*
            BLUE
        */

        retroContext.fillStyle = "rgba(0,100,255,0.04)";

        retroContext.fillRect(10, y + 1, retroWidth, height);
    }
}

/* ================================= */
/* FLICKER                           */
/* ================================= */

function drawFlicker() {
    const alpha = random(0.005, 0.035);

    retroContext.fillStyle = `rgba(
            255,
            255,
            255,
            ${alpha}
        )`;

    retroContext.fillRect(0, 0, retroWidth, retroHeight);
}

/* ================================= */
/* VIGNETTE                          */
/* ================================= */

function drawVignette() {
    const gradient = retroContext.createRadialGradient(
        retroWidth / 2,
        retroHeight / 2,

        retroHeight * 0.15,

        retroWidth / 2,
        retroHeight / 2,

        retroHeight * 0.75,
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");

    gradient.addColorStop(0.7, "rgba(0,0,0,0.05)");

    gradient.addColorStop(1, "rgba(0,0,0,0.4)");

    retroContext.fillStyle = gradient;

    retroContext.fillRect(0, 0, retroWidth, retroHeight);
}

/* ================================= */
/* MAIN LOOP                         */
/* ================================= */

function renderRetro() {
    /*
        Clear
    */

    retroContext.clearRect(0, 0, retroWidth, retroHeight);

    /*
        CRT scanlines
    */

    drawScanlines();

    /*
        VHS tracking
    */

    drawTracking();

    /*
        Random glitches
    */

    drawGlitch();

    /*
        RGB lines
    */

    drawRGBLines();

    /*
        Flicker
    */

    drawFlicker();

    /*
        Vignette
    */

    drawVignette();

    requestAnimationFrame(renderRetro);
}

renderRetro();
