var LeapMotionDinoDemo = function(parent) {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });

    // Add generated <canvas> to page
    var container = document.getElementById('leapMotionDino');
    container.appendChild( renderer.domElement );

    var width = parent.width;
    var height = parent.height;

    renderer.setSize( width, height );

    // Make a scene
    var scene = new THREE.Scene();

    // Create a camera
    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.y = 100;
    camera.position.z = 400;

    // Add it to the scene
    scene.add( camera );

    var controls = new THREE.FlyControlsMod( camera );

    controls.movementSpeed = 30;
    controls.rollSpeed = 0.1;
    controls.dragToLook = true; // Just moving mouse shouldn't change rotation

    // Lights
    var ambientLight = new THREE.AmbientLight( 0xDDDDDD );
    scene.add( ambientLight );

    var spotLight = new THREE.SpotLight(0xFFFFFF, 1.0, 2000);
    spotLight.position.set( 50, 50, 300 ); // x, y, z
    spotLight.target.position.set( 0, -100, -100 );
    scene.add( spotLight );

    // Dinosaur
    var loader = new THREE.JSONLoader();
    var mesh;

    var clock = new THREE.Clock();

    var filePath = '../models/trex/trex.js';

    loader.load(filePath, function(geometry, materials) {

        mesh = new THREE.Mesh( geometry,
                new THREE.MeshFaceMaterial( materials ) );

        mesh.scale.set(10, 10, 10);
        mesh.rotation.y = Math.PI / 2;
        mesh.position.set( 0, 0, 0 );

        scene.add( mesh );

        animate();

    });

    var animate = function() {

        // Optimisation
        if( parent.activationFlags.leapMotionDino ) {

            renderer.render( scene, camera );

            var delta = clock.getDelta();

            controls.update(delta);

        }

        requestAnimationFrame( animate );

    };

    this.updateSize = function() {

        console.log('Update size');

        var width = parent.width;
        var height = parent.height;

        renderer.setSize( width, height );

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

    };

};
