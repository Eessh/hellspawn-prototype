type TViewportProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

function Viewport({ canvasRef }: TViewportProps) {    
    return (
        <canvas ref={canvasRef} />
    );
};

export default Viewport;