import { ArcRotateCamera, Color3, Color4, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Tools, Vector3, StandardMaterial } from '@babylonjs/core';
import SceneView from './components/Scene';
import { GridMaterial } from '@babylonjs/materials';

let box: Mesh;

const onSceneReady = (scene: Scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

const createScene = (scene: Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

    // --- Camera Setup (ArcRotateCamera for Blender-like controls) ---
    // Parameters: name, alpha, beta, radius, target, scene
    const camera = new ArcRotateCamera("camera",
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
    camera.angularSensibilityY = 200; // Controls vertical orbit speed
    camera.pinchPrecision = 200;      // Controls pinch zoom sensitivity on touch
    camera.wheelPrecision = 0.5;      // Controls mouse wheel zoom sensitivity (lower is more sensitive)

    // Enable panning: Middle mouse button or Shift + Left mouse button
    camera.panningSensibility = 500; // Controls panning speed
    camera.useAutoRotationBehavior = false; // Disable default auto-rotation
    camera.upperRadiusLimit = 500; // Max zoom out
    camera.lowerRadiusLimit = 2; // Min zoom in

    // Override default mouse handling for Blender-like orbit/pan
    // This requires careful handling as Babylon.js default is different.
    // For Blender: Left-click=Select, Middle-click=Orbit, Shift+Middle-click=Pan, Scroll=Zoom.
    // Babylon.js ArcRotateCamera defaults: Left-click=Orbit, Middle-click/Right-click=Pan, Scroll=Zoom.

    // Customizing inputs for Blender-like behavior
    // Remove default Babylon.js mouse wheel for zoom if you want to use custom
    // camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");
    // Add custom handlers for middle click pan if needed.
    // By default, ArcRotateCamera handles middle click for pan, which aligns with Blender's Shift+Middle-Click.
    // Blender's Middle-click for Orbit is default for ArcRotateCamera's left click.
    // So, for typical use, ArcRotateCamera's defaults are close.
    // If you truly need Blender's exact interaction, you'd disable Babylon's default inputs
    // and implement a custom input manager, listening for mouse events and applying forces.
    // For this example, we'll rely on the ArcRotateCamera's robust defaults which cover orbit, pan, zoom.

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

    // --- 2000 Cubes ---
    const numberOfCubes = 2000;
    const boundingBox = 100; // Cubes will be placed within -50 to 50 on X and Z

    for (let i = 0; i < numberOfCubes; i++) {
        const box = MeshBuilder.CreateBox("box" + i, { size: 1 }, scene);

        // Random position within a specified range
        box.position.x = (Math.random() - 0.5) * boundingBox;
        box.position.y = Math.random() * 5 + 0.5; // Ensure cubes are above ground
        box.position.z = (Math.random() - 0.5) * boundingBox;

        // Random color for each cube
        const material = new StandardMaterial("material" + i, scene);
        material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
        box.material = material;
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

function App() {
  return (
    <SceneView antialias={true} adaptToDeviceRatio={true} engineOptions={{preserveDrawingBuffer: true, stencil: true}} sceneOptions={{}} onSceneReady={createScene} onRender={onRender}/>
  )
}

export default App
