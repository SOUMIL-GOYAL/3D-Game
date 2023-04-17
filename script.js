var canvas = document.getElementById("renderCanvas");

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
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

const createScene = function () {
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

  scene.enablePhysics(BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
  scene.collisionsEnabled = true;


  camera.applyGravity = true;
  camera.checkCollisions = true;

  return scene;
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  
  


  window.scene = createScene();
  
  const { meshes} = BABYLON.SceneLoader.ImportMesh(
    "",
    "/3D-Game/",
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

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});

/*var scene;
var engine;

function constructor(canvas) {
    engine = new BABYLON.Engine(canvas, true);
    scene = CreateScene();

    CreateEnvironment();

    CreateController();

    engine.runRenderLoop(() => {
    scene.render();
    });
}

function CreateScene() {
    const scene = new BABYLON.Scene(this.engine);
    const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

    scene.onPointerDown = (evt) => {
    if (evt.button === 0) engine.enterPointerlock();
    if (evt.button === 1) engine.exitPointerlock();
    };

    const framesPerSecond = 60;
    const gravity = -9.81;
    scene.gravity = new BABYLON.Vector3(0, gravity / framesPerSecond, 0);
    scene.collisionsEnabled = true;

    return scene;
}

async function CreateEnvironment() {
  const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "both_houses_scene.babylon",
    scene
  );

  meshes.map((mesh) => {
    mesh.checkCollisions = true;
  });
}

function CreateController() {
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, 0), scene);
    camera.attachControl();

    camera.applyGravity = true;
    camera.checkCollisions = true;

    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    camera.minZ = 0.45;
    camera.speed = 0.75;
    camera.angularSensibility = 4000;

    camera.keysUp.push(87);
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
}


constructor(document.getElementById("renderCanvas"));
*/


/*

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var meshes;

// Add your code here matching the playground format
const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  BABYLON.SceneLoader.ImportMesh(
    "",
    "/3D-Game/",
    "basicmap.babylon",
    scene,
    (newMeshes) => {
      newMeshes[0].rotationQuaternion = null;
      newMeshes[0].rotation.y = Math.PI / 2;
      newMeshes[0].rotation.z = Math.PI/2;
      newMeshes[0].rotation.x = -Math.PI / 2;

    }
  );

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});


*/