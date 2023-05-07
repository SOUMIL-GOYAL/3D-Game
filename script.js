import constants from './constants.js';
var  camera;
var targets = [];

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

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
  var loadedGUI = advancedTexture.parseFromURLAsync("guiTexture.json");

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
  const cameraposition = camera.position;
  const cameradirection = camera.getDirection(BABYLON.Vector3.Forward());

  const sphere = BABYLON.MeshBuilder.CreateSphere("bullet", {diameter: constants.BULLETCONSTANTS.DIAMETER, segments: constants.BULLETCONSTANTS.SEGMENTS}, scene);
  sphere.position.x = cameraposition.x + cameradirection.x*constants.BULLETCONSTANTS.DISTANCEAHEAD;
  sphere.position.y = cameraposition.y;
  sphere.position.z = cameraposition.z + cameradirection.z*constants.BULLETCONSTANTS.DISTANCEAHEAD;

  sphere.checkCollisions = true;

  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: constants.BULLETCONSTANTS.MASS, restitution: constants.BULLETCONSTANTS.RESTITUTION}, scene);
  sphere.physicsImpostor.applyImpulse(cameradirection.scale(constants.BULLETCONSTANTS.FORCESCALE), sphere.getAbsolutePosition());
  addaction(sphere);
}

function addaction(sphere) {
  targets.forEach(function(target) {
    sphere.actionManager = new BABYLON.ActionManager();
    sphere.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
              trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
              parameter: target,
          },
          (event) => {
            target.dispose();
            targets = targets.filter(i => i != target);
          }
      )
    );
  });
  
}

function spawntarget () {
  const spawnposition = new BABYLON.Vector3(0, 400, 400);

  const sphere = BABYLON.MeshBuilder.CreateSphere("target", {diameter: 400, segments: 32}, scene);
  sphere.position = spawnposition;
  sphere.checkCollisions = true;

  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.9}, scene);

  targets.push(sphere);

  console.log(targets);
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === " ") {
      shoot();
  }
  if (event.key === "Enter") {
    spawntarget();
}
});


initFunction().then(() => {
  sceneToRender = scene;
});
// Resize
window.addEventListener("resize", function () {
  engine.resize();
});