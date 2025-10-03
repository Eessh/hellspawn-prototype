type TViewportProps = {
    readonly canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

function Viewport({ canvasRef }: TViewportProps) {    
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            canvasRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <>
            <canvas ref={canvasRef} />
            <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, backgroundColor: 'white' }} onClick={toggleFullscreen}>Toggle Fullscreen</button>
        </>
    );
};

export default Viewport;