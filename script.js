//import constants from './constants.js';
//const pig = import("./constants.js").then(function () {console.log("done")});

import { CAMERACONSTANTS} from "./constants.js";

const canvas = document.getElementById("renderCanvas");

console.log(CAMERACONSTANTS);



var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;

function createDefaultEngine () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.enablePhysics(BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
  scene.collisionsEnabled = true;

  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 700, 0),
    scene
  );
  camera.attachControl();
  camera.ellipsoid = new BABYLON.Vector3(20, 200, 20);
  camera.minZ = 0.45;
  camera.speed = 5;
  camera.angularSensibility = 4000;
  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.attachControl(canvas, true);
  camera.applyGravity = true;
  camera.checkCollisions = true;


  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(3, 1, 0)
  );

  scene.onPointerDown = (evt) => {
    if (evt.button === 0) engine.enterPointerlock();
    if (evt.button === 1) engine.exitPointerlock();
  };

  return scene;
};

async function asyncEngineCreation () {
  try {
    return createDefaultEngine();
  } catch (e) {
    console.log(
      "the available createEngine function failed. Creating the default engine instead"
    );
    return createDefaultEngine();
  }
};

async function initFunction () {
  var engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);

  var scene = createScene();
  
  const map = BABYLON.SceneLoader.ImportMesh(
    "",
    "/3D-Game/models/",
    "cubeplane1.glb",
    scene,
    (newMeshes) => {
      newMeshes[0].rotationQuaternion = null;
      newMeshes[0].rotation.y = Math.PI / 2;
      newMeshes[0].rotation.z = Math.PI/2;
      newMeshes[0].rotation.x = -Math.PI / 2;
      newMeshes[0].checkCollisions = true;
      console.log(newMeshes[0]);
      newMeshes.map((mesh) => {mesh.checkCollisions = true;});
    }
  );
  
};


initFunction().then(() => {
  sceneToRender = scene;
});


window.addEventListener("resize", function () {
  engine.resize();
  console.log(constants.CAMERACONSTANTS);
});
