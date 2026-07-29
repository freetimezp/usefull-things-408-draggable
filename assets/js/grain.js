/* ================================= */
/* FILM GRAIN                        */
/* ================================= */

const grainCanvas = document.querySelector("#grain");

const grainContext = grainCanvas.getContext("2d");

let grainWidth = 0;
let grainHeight = 0;

/* ================================= */
/* RESIZE                            */
/* ================================= */

function resizeGrain() {
    grainWidth = grainCanvas.width = window.innerWidth;

    grainHeight = grainCanvas.height = window.innerHeight;
}

resizeGrain();

window.addEventListener("resize", resizeGrain);

/* ================================= */
/* GRAIN                             */
/* ================================= */

function drawGrain() {
    /*
        Render at lower
        resolution.

        This makes the grain
        look more analog.
    */

    const scale = 4;

    const width = Math.ceil(grainWidth / scale);

    const height = Math.ceil(grainHeight / scale);

    const imageData = grainContext.createImageData(width, height);

    const data = imageData.data;

    /*
        Generate noise
    */

    for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;

        data[i] = value;

        data[i + 1] = value;

        data[i + 2] = value;

        /*
            Mostly transparent
        */

        data[i + 3] = Math.random() * 90;
    }

    /*
        Temporary canvas
    */

    const tempCanvas = document.createElement("canvas");

    tempCanvas.width = width;

    tempCanvas.height = height;

    const tempContext = tempCanvas.getContext("2d");

    tempContext.putImageData(imageData, 0, 0);

    /*
        Clear
    */

    grainContext.clearRect(0, 0, grainWidth, grainHeight);

    /*
        Pixelated scale
    */

    grainContext.imageSmoothingEnabled = false;

    grainContext.drawImage(
        tempCanvas,

        0,
        0,

        width,
        height,

        0,
        0,

        grainWidth,
        grainHeight,
    );
}

/* ================================= */
/* LOOP                              */
/* ================================= */

let lastGrainTime = 0;

const grainFPS = 24;

const grainInterval = 1000 / grainFPS;

function renderGrain(timestamp) {
    if (timestamp - lastGrainTime >= grainInterval) {
        lastGrainTime = timestamp;

        drawGrain();
    }

    requestAnimationFrame(renderGrain);
}

requestAnimationFrame(renderGrain);
