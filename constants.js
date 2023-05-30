const CAMERACONSTANTS = {
    STARTINGPOSITION: new BABYLON.Vector3(0, 600, 400),
    ELIPSOIDDIMENSIONS: new BABYLON.Vector3(20, 100, 20),
    MINZ: .45,
    SPEED: 15,
    ANGULARSENSIBILITY: 1000,

};

const MESHCONSTANTS = {
    PATHTOFOLDER:"./models/",
    MESHNAME: "cubeplane1.glb",
    MAPROTATIONX: -Math.PI / 2,
    MAPROTATIONY: Math.PI / 2,
    MAPROTATIONZ: Math.PI / 2,
};

const LIGHTCONSTANTS = {
    LIGHTPOSITION : new BABYLON.Vector3(3, 1, 0),
}

const PHYSICSCONSTANTS = {
    GRAVITYVECTOR: new BABYLON.Vector3(0, -9.81, 0),
}

const BULLETCONSTANTS = {
    DIAMETER: 2,
    SEGMENTS: 32,
    DISTANCEAHEAD: 50,
    MASS: 1,
    RESTITUTION: .9,
    FORCESCALE: 1000,
    RANDOMFACTOR: .04,
    

}

const SPAWNCONSTANTS = {
    DIAMETER: 100,
    SEGMENTS: 32,
    MASS: 0,
    RESTITUTION: .9,
    POSSIBLELOCATIONS: [new BABYLON.Vector3(300, 400, 400), 
        new BABYLON.Vector3(400, 400, 400), 
        new BABYLON.Vector3(400, 400, 0),
        new BABYLON.Vector3(-400, 400, 0),
        new BABYLON.Vector3(-400, 400, 300),
        new BABYLON.Vector3(-400, 400, 400),
        new BABYLON.Vector3(-400, 300, 400),
        new BABYLON.Vector3(0, 400, -400),
        new BABYLON.Vector3(0, 400, 400),
        new BABYLON.Vector3(300, 400, -400),
    ],
    TEXTURES: [
        "textures/fossilfuels.jpeg",
        "textures/oil.jpeg",
        "textures/factory.jpeg",
        "textures/gas.jpeg",
    ]
}

export default {
    CAMERACONSTANTS,
    MESHCONSTANTS,
    LIGHTCONSTANTS,
    PHYSICSCONSTANTS,
    BULLETCONSTANTS,
    SPAWNCONSTANTS,

};
