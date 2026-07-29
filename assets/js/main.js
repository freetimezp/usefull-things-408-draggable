const scene = document.querySelector(".scene");

const sourceVideo = document.querySelector("#source-video");

const windows = document.querySelectorAll(".window");

/* ================================= */
/* CANVAS                            */
/* ================================= */

const videoCanvas = document.createElement("canvas");

const videoContext = videoCanvas.getContext("2d");

/* ================================= */
/* STATE                             */
/* ================================= */

let activeWindow = null;

let pointerId = null;

let startPointerX = 0;
let startPointerY = 0;

let startWindowX = 0;
let startWindowY = 0;

let zIndex = 10;

/* ================================= */
/* VIDEO READY                       */
/* ================================= */

sourceVideo.addEventListener("loadedmetadata", () => {
    videoCanvas.width = sourceVideo.videoWidth;

    videoCanvas.height = sourceVideo.videoHeight;

    /*
            Start rendering
        */

    renderVideo();
});

/* ================================= */
/* RENDER VIDEO                      */
/* ================================= */

function renderVideo() {
    if (sourceVideo.readyState >= 2) {
        /*
            Draw current video frame
        */

        videoContext.drawImage(
            sourceVideo,

            0,
            0,

            videoCanvas.width,
            videoCanvas.height,
        );

        /*
            Convert frame
            to image
        */

        const frame = videoCanvas.toDataURL("image/jpeg", 0.8);

        /*
            Apply frame to
            every window
        */

        windows.forEach((window) => {
            const view = window.querySelector(".video-view");

            view.style.backgroundImage = `url(${frame})`;
        });
    }

    /*
        Continue rendering
    */

    requestAnimationFrame(renderVideo);
}

/* ================================= */
/* WINDOW DRAGGING                   */
/* ================================= */

windows.forEach((window) => {
    window.addEventListener("pointerdown", startDrag);
});

/* ================================= */
/* START DRAG                        */
/* ================================= */

function startDrag(event) {
    activeWindow = event.currentTarget;

    pointerId = event.pointerId;

    /*
        Bring to front
    */

    zIndex++;

    activeWindow.style.zIndex = zIndex;

    /*
        Current position
    */

    const rect = activeWindow.getBoundingClientRect();

    startWindowX = rect.left;

    startWindowY = rect.top;

    /*
        Pointer position
    */

    startPointerX = event.clientX;

    startPointerY = event.clientY;

    /*
        Capture pointer
    */

    activeWindow.setPointerCapture(pointerId);

    activeWindow.addEventListener("pointermove", drag);

    activeWindow.addEventListener("pointerup", stopDrag);
}

/* ================================= */
/* DRAG                              */
/* ================================= */

function drag(event) {
    if (!activeWindow) {
        return;
    }

    const deltaX = event.clientX - startPointerX;

    const deltaY = event.clientY - startPointerY;

    const newX = startWindowX + deltaX;

    const newY = startWindowY + deltaY;

    /*
        Move window
    */

    activeWindow.style.left = `${newX}px`;

    activeWindow.style.top = `${newY}px`;

    /*
        Update video position
    */

    updateVideoPosition(activeWindow);

    /*
        Update coordinates
    */

    updateCoordinates(activeWindow);
}

/* ================================= */
/* STOP DRAG                         */
/* ================================= */

function stopDrag(event) {
    if (!activeWindow) {
        return;
    }

    activeWindow.releasePointerCapture(pointerId);

    activeWindow.removeEventListener("pointermove", drag);

    activeWindow.removeEventListener("pointerup", stopDrag);

    activeWindow = null;

    pointerId = null;
}

/* ================================= */
/* VIDEO POSITION                    */
/* ================================= */

function updateVideoPosition(window) {
    const view = window.querySelector(".video-view");

    const rect = window.getBoundingClientRect();

    /*
        The video image is
        the size of the viewport.

        Move the background
        opposite to the window.
    */

    const x = -rect.left;

    const y = -rect.top;

    view.style.backgroundPosition = `${x}px ${y}px`;
}

/* ================================= */
/* COORDINATES                       */
/* ================================= */

function updateCoordinates(window) {
    const rect = window.getBoundingClientRect();

    const x = Math.round(rect.left);

    const y = Math.round(rect.top);

    const xElement = window.querySelector(".x");

    const yElement = window.querySelector(".y");

    xElement.textContent = `X: ${String(x).padStart(4, "0")}PX`;

    yElement.textContent = `Y: ${String(y).padStart(4, "0")}PX`;
}

/* ================================= */
/* INITIAL VIDEO POSITION            */
/* ================================= */

windows.forEach((window) => {
    updateVideoPosition(window);
});
