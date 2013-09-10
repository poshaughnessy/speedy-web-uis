(function() {

    // Create a canvas renderer
    var renderer = new THREE.CanvasRenderer();

    // Add generated <canvas> to page

    var container = document.getElementById('container');

    container.appendChild( renderer.domElement );

    // Dimensions for renderer

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    renderer.setSize( width, height );

    // Make a scene

    var scene = new THREE.Scene();

    // Camera, position and add to scene

    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.y = 0;
    camera.position.z = 1000;

    scene.add( camera );

    // Create a block

    function createBlock(x, y, colorHex) {

        var geometry = new THREE.CubeGeometry(100, 100, 50);

        var colour = new THREE.Color(colorHex);

        var material = new THREE.MeshBasicMaterial({color: colour});

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, 0);

        scene.add( mesh );

    }

    // Set up blocks

    var BLOCK_SIZE = 100;

    createBlock( 0, 0, 0x0000FF );

    createBlock( 0, -BLOCK_SIZE, 0xFF3333 );

    createBlock( BLOCK_SIZE, -BLOCK_SIZE, 0x00FF00 );


    // Controls

    var controls = new THREE.TrackballControls( camera, renderer.domElement );

    // Stats

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.right = '0px';
    container.appendChild( stats.domElement );

    // Animate

    var animate = function() {

        renderer.render( scene, camera );

        requestAnimationFrame( animate );

        controls.update();

        stats.update();

    };

    animate();

})();
