import constants from './constants.js';
var  camera;

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
  return (new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  }));
}

function createScene() {
  const scene = new BABYLON.Scene(engine);
  camera = new BABYLON.FreeCamera(
    "camera",
    constants.CAMERACONSTANTS.STARTINGPOSITION,
    scene
  );
  camera.attachControl();

  camera.ellipsoid = constants.CAMERACONSTANTS.ELIPSOIDDIMENSIONS;

  camera.minZ = constants.CAMERACONSTANTS.MINZ;
  camera.speed = constants.CAMERACONSTANTS.SPEED;
  camera.angularSensibility = constants.CAMERACONSTANTS.ANGULARSENSIBILITY;
  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    constants.LIGHTCONSTANTS.LIGHTPOSITION,
  );  ''
  scene.onPointerDown = (evt) => {
    if (evt.button === 0) engine.enterPointerlock();
    if (evt.button === 1) engine.exitPointerlock();
  };

  scene.enablePhysics(
    constants.PHYSICSCONSTANTS.GRAVITYVECTOR,
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
    constants.MESHCONSTANTS.PATHTOFOLDER,
    constants.MESHCONSTANTS.MESHNAME,
    scene,
    (newMeshes) => {
      newMeshes[0].rotationQuaternion = null;

      newMeshes[0].rotation.x = constants.MESHCONSTANTS.MAPROTATIONX;
      newMeshes[0].rotation.y = constants.MESHCONSTANTS.MAPROTATIONY;
      newMeshes[0].rotation.z = constants.MESHCONSTANTS.MAPROTATIONZ;
      
      newMeshes[0].checkCollisions = true;
      console.log(newMeshes[0]);
      newMeshes.map((mesh) => {
        mesh.checkCollisions = true;
      });
    }
  );

  
}

function shoot () {
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 80, segments: 32}, scene);
  sphere.position = camera.position;
  sphere.checkCollisions = true;

  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

  var forceDirection = camera.getDirection(BABYLON.Vector3.Forward());

  sphere.physicsImpostor.applyImpulse(forceDirection.scale(100), sphere.getAbsolutePosition());

  /*
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 80, segments: 32}, scene);
  const cameraposition = camera.position;
  console.log(cameraposition);
  console.log(cameraposition.z);
  sphere.position = BABYLON.Vector3(cameraposition.x, cameraposition.y, cameraposition.z + 5);
  sphere.checkCollisions = true;

  sphere.physicsImpostor = BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

  var forceDirection = camera.getDirection(BABYLON.Vector3.Forward());

  sphere.physicsImpostor.applyImpulse(forceDirection.scale(100), sphere.getAbsolutePosition());
  */
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === " ") {
      shoot();
  }
});


initFunction().then(() => {
  sceneToRender = scene;
});
// Resize
window.addEventListener("resize", function () {
  engine.resize();
});


