(function() {

    // Create a canvas renderer
    var renderer = new THREE.CanvasRenderer();

    // Add generated <canvas> to page

    var container = document.getElementById('container');

    container.appendChild( renderer.domElement );

    // Dimensions for renderer

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    renderer.setSize( container.offsetWidth, container.offsetHeight );

    // Make a scene

    var scene = new THREE.Scene();

    // Camera, position and add to scene

    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.y = 100;
    camera.position.z = 800;

    // Let there be light

    var ambientLight = new THREE.AmbientLight( 0xDDDDDD );
    scene.add( ambientLight );

    // Create a block


    // Set up blocks


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
