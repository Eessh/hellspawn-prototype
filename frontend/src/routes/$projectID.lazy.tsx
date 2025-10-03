import { createLazyFileRoute } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArcRotateCamera, Color3, Color4, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Tools, Vector3, StandardMaterial, Engine } from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { useEffect, useRef } from 'react';
import Viewport from '@/components/Viewport';

export const Route = createLazyFileRoute('/$projectID')({
  component: RouteComponent,
});

let box: Mesh;

const initScene = (scene: Scene, camera: ArcRotateCamera) => {
  const canvas = scene.getEngine().getRenderingCanvas();
  scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

  // --- Camera Setup (ArcRotateCamera for Blender-like controls) ---
  // Parameters: name, alpha, beta, radius, target, scene
  camera = new ArcRotateCamera("camera",
    Tools.ToRadians(90),    // alpha (rotation around Y-axis)
    Tools.ToRadians(60),    // beta (rotation around X-axis from pole)
    50,                             // radius (distance from target)
    Vector3.Zero(),         // target (point the camera looks at)
    scene
  );
  camera.setTarget(Vector3.Zero()); // Ensure camera looks at origin initially

  // Attach camera controls to the canvas
  camera.attachControl(canvas, true);

  // Configure camera sensitivities for a Blender-like feel
  camera.angularSensibilityX = 200; // Controls horizontal orbit speed
  camera.angularSensibilityY = 400; // Controls vertical orbit speed
  camera.pinchPrecision = 0.5;      // Controls pinch zoom sensitivity on touch
  camera.wheelPrecision = 1.3;      // Controls mouse wheel zoom sensitivity (lower is more sensitive)
  camera.inertia = 0.5; // Controls inertia for horizontal rotation

  // Enable panning: Middle mouse button or Shift + Left mouse button
  camera.panningSensibility = 200; // Controls panning speed
  camera.useAutoRotationBehavior = false; // Disable default auto-rotation
  camera.upperRadiusLimit = 500; // Max zoom out
  camera.lowerRadiusLimit = 2; // Min zoom in

  // camera.inputs.clear(); // Clear default inputs

  camera.keysLeft = [37]; // Left arrow key
  camera.keysRight = [39]; // Right arrow key
  camera.keysUp = [38]; // Up arrow key
  camera.keysDown = [40]; // Down arrow key

  // --- WASD & Arrow Key Controls ---
  // We'll move the camera's target and position in the render loop based on key state
  const keyState: Record<string, boolean> = {};
  const moveSpeed = 1.0;
  const verticalSpeed = 0.01;
  const rotateSpeed = 0.025; // radians per frame

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.length === 1) {
      keyState[e.key.toLowerCase()] = true;
    } else {
      keyState[e.key] = true;
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key.length === 1) {
      keyState[e.key.toLowerCase()] = false;
    } else {
      keyState[e.key] = false;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Remove listeners on scene dispose
  scene.onDisposeObservable.add(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  // Move camera in the render loop
  scene.onBeforeRenderObservable.add(() => {
    // Calculate forward and right vectors based on camera's actual facing direction
    let forward = camera.target.subtract(camera.position);
    forward.y = 0;
    forward = forward.normalize();
    let right = Vector3.Cross(Vector3.Up(), forward).normalize();

    let move = Vector3.Zero();
    if (keyState['w']) move = move.add(forward.scale(moveSpeed));
    if (keyState['s']) move = move.subtract(forward.scale(moveSpeed));
    if (keyState['a']) move = move.subtract(right.scale(moveSpeed));
    if (keyState['d']) move = move.add(right.scale(moveSpeed));

    if (!move.equals(Vector3.Zero())) {
      camera.target.addInPlace(move);
      camera.position.addInPlace(move);
    }

  //   // Arrow Left/Right: rotate camera view
    if (keyState['ArrowUp']) {
      camera.beta -= verticalSpeed;
    }
    if (keyState['ArrowDown']) {
      camera.beta += verticalSpeed;
    }
    if (keyState['ArrowLeft']) {
      camera.alpha += rotateSpeed;
    }
    if (keyState['ArrowRight']) {
      camera.alpha -= rotateSpeed;
    }
  });

  // --- Lighting ---
  // Parameters: name, direction, scene
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7; // Adjust light intensity

  // --- Infinite Grid (Blender-like) ---
  const ground = MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, scene);
  const gridMaterial = new GridMaterial("gridMaterial", scene);
  gridMaterial.majorUnitFrequency = 5; // Major grid lines every 5 units
  gridMaterial.minorUnitVisibility = 0.4; // Minor grid lines visibility
  gridMaterial.gridRatio = 1; // Size of a single grid cell
  gridMaterial.backFaceCulling = false; // Render grid from both sides
  gridMaterial.mainColor = new Color3(0.05, 0.05, 0.05); // Dark background color
  gridMaterial.lineColor = new Color3(0.2, 0.2, 0.2); // Grid line color
  gridMaterial.opacity = 0.9;
  ground.material = gridMaterial;
  ground.position.y = -0.01; // Slightly below other objects

  // --- 2000 Cubes (optimized with instancing) ---
  const numberOfCubes = 2000;
  const boundingBox = 100; // Cubes will be placed within -50 to 50 on X and Z
  
  // Create a single box mesh as the source
  const boxSource = MeshBuilder.CreateBox("boxSource", { size: 1 }, scene);
  boxSource.isVisible = false; // Hide the source mesh
  
  // Create instances of the box
  for (let i = 0; i < numberOfCubes; i++) {
    // Create an instance of the box
    // 1) It reduces memory usage by sharing the same geometry data across all instances
    // 2) It reduces draw calls by batching instances together
    // 3) It maintains the same visual appearance while being much more GPU-friendly
    // Instancing is perfect for this scenario where you have many objects with the same geometry,
    // but different transformations (position, rotation, scaling) and materials.
    // The GPU can process instances much more efficiently than individual meshes.
    const boxInstance = boxSource.createInstance("boxInstance" + i);
    
    // Random position within a specified range
    boxInstance.position.x = (Math.random() - 0.5) * boundingBox;
    boxInstance.position.y = Math.random() * 5 + 0.5; // Ensure cubes are above ground
    boxInstance.position.z = (Math.random() - 0.5) * boundingBox;
    
    // Random color for each instance using the instance's material
    const material = new StandardMaterial("material" + i, scene);
    material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
    boxInstance.material = material;
  }

  // --- Render Loop ---
  // engine.runRenderLoop(function () {
  //     scene.render();
  // });

  // --- Babylon.js Inspector Shortcut ---
  // const inspectorHost = document.getElementById('inspectorHost');
  // window.addEventListener("keydown", function (event) {
  //     // Using F9 key to toggle inspector
  //     if (event.key === "F9") {
  //         event.preventDefault(); // Prevent default browser behavior

  //         if (scene.debugLayer.isVisible()) {
  //             scene.debugLayer.hide();
  //             inspectorHost.classList.remove('show'); // Hide the host div
  //         } else {
  //             if (BABYLON.Inspector) {
  //                 // Show inspector, embedding it into the 'inspectorHost' div
  //                 scene.debugLayer.show({
  //                     embedMode: true,
  //                     globalRoot: inspectorHost,
  //                     enableClose: false // Prevent inspector's own close button from interfering
  //                 });
  //                 inspectorHost.classList.add('show'); // Show the host div
  //             } else {
  //                 showMessageBox("Babylon.js Inspector not loaded. Check CDN link.");
  //             }
  //         }
  //         // Crucial: Resize engine after inspector toggle, as canvas size changes
  //         engine.resize();
  //     }
  // });

  return scene;
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

function RouteComponent() {
  const engineRef = useRef<Engine>(null);
  const sceneRef = useRef<Scene>(null);
  const cameraRef = useRef<ArcRotateCamera>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas not found");
      return;
    }

    engineRef.current = new Engine(canvasRef.current, true, {preserveDrawingBuffer: true, stencil: true}, true);
    sceneRef.current = new Scene(engineRef.current, {});

    if (sceneRef.current.isReady()) {
      initScene(sceneRef.current, cameraRef.current!);
    }
    else {
      sceneRef.current.onReadyObservable.addOnce(scene => initScene(scene, cameraRef.current!));
    }

    engineRef.current.runRenderLoop(() => {
      onRender(sceneRef.current!);

      sceneRef.current!.render();
    });

    return () => {
      sceneRef.current!.getEngine().dispose();
    };
  });

  const resizeHandler = () => {
    if (!sceneRef.current) {
      return;
    }

    sceneRef.current.getEngine().resize();
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>Scene Tree</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel onResize={resizeHandler}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel style={{ position: "relative" }} onResize={resizeHandler}>
            <Viewport canvasRef={canvasRef} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Console</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>Properties</ResizablePanel>
    </ResizablePanelGroup>
  );
}
