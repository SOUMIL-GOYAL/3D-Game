import constants from './constants.js';


console.log(constants);

var canvas = document.getElementById("renderCanvas");

function startRenderLoop(engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var engine = null;
var scene = null;
var sceneToRender = null;

function createDefaultEngine() {
  console.log("yoyoyo");
  return (new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  }));
}

function createScene() {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 700, 0),
    scene
  );
  camera.attachControl();

  camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);

  camera.minZ = 0.45;
  camera.speed = 5;
  camera.angularSensibility = 4000;
  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(3, 1, 0)
  );
  scene.onPointerDown = (evt) => {
    if (evt.button === 0) engine.enterPointerlock();
    if (evt.button === 1) engine.exitPointerlock();
  };

  scene.enablePhysics(
    BABYLON.Vector3(0, -9.81, 0),
    new BABYLON.CannonJSPlugin()
  );
  scene.collisionsEnabled = true;

  camera.applyGravity = true;
  camera.checkCollisions = true;

  return scene;
}

function asyncEngineCreation() {
  try {
    var thing = createDefaultEngine();
    console.log(thing);
    return thing;

  } catch (e) {
    console.log(
      "the available createEngine function failed. Creating the default engine instead"
    );
    return createDefaultEngine();
  }
}

async function initFunction() {
  engine = asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);

  scene = createScene();

  const { meshes } = BABYLON.SceneLoader.ImportMesh(
    "",
    "./models/",
    "cubeplane1.glb",
    scene,
    (newMeshes) => {
      newMeshes[0].rotationQuaternion = null;
      newMeshes[0].rotation.y = Math.PI / 2;
      newMeshes[0].rotation.z = Math.PI / 2;
      newMeshes[0].rotation.x = -Math.PI / 2;
      newMeshes[0].checkCollisions = true;
      console.log(newMeshes[0]);
      newMeshes.map((mesh) => {
        mesh.checkCollisions = true;
      });
    }
  );
}
initFunction().then(() => {
  sceneToRender = scene;
});
// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
