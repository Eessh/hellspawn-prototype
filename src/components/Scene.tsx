import { useEffect, useRef } from "react";
import { Engine, Scene, type EngineOptions, type SceneOptions } from "@babylonjs/core";

type TSceneViewProps = {
    antialias: boolean;
    adaptToDeviceRatio: boolean;
    engineOptions: EngineOptions;
    sceneOptions: SceneOptions;
    onSceneReady: (scene: Scene) => void;
    onRender: (scene: Scene) => void;
};

function SceneView(props: TSceneViewProps) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        const engine = new Engine(canvas.current, props.antialias, props.engineOptions, props.adaptToDeviceRatio);
        const scene = new Scene(engine, props.sceneOptions);

        if (scene.isReady()) {
            props.onSceneReady(scene);
        }
        else {
            scene.onReadyObservable.addOnce(scene => props.onSceneReady(scene));
        }

        engine.runRenderLoop(() => {
            if (typeof props.onRender === "function") {
                props.onRender(scene);
            }

            scene.render();
        });

        function resizeHandler() {
            scene.getEngine().resize();
        }

        window.addEventListener("resize", resizeHandler);

        return () => {
            scene.getEngine().dispose();
            window.removeEventListener("resize", resizeHandler);
        };
    }, [props]);

    return (
        <canvas ref={canvas} />
    );
};

export default SceneView;