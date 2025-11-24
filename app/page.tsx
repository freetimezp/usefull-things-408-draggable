import VideoWindow from "../components/VideoWindow";

export interface WindowData {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
}

export interface WindowInput {
    id: string;
    left: number;
    top: number;
    width: number;
    zIndex: number;
}

const createWindow = (input: WindowInput): WindowData => ({
    ...input,
    height: Math.round((input.width * 9) / 16),
});

const initialWindows: WindowData[] = [
    { id: "w1", left: 138, top: 88, width: 650, zIndex: 1 },
    { id: "w2", left: 278, top: 269, width: 350, zIndex: 2 },
    { id: "w3", left: 278, top: 518, width: 600, zIndex: 3 },
    { id: "w4", left: 1197, top: 86, width: 500, zIndex: 4 },
    { id: "w5", left: 154, top: 513, width: 300, zIndex: 5 },
    { id: "w6", left: 668, top: 155, width: 1100, zIndex: 6 },
].map(createWindow);

export default function Page() {
    return (
        <main className="relative h-screen w-screen cursor-default overflow-hidden">
            <VideoWindow windows={initialWindows} videoSrc="/video.mp4" />
        </main>
    );
}
