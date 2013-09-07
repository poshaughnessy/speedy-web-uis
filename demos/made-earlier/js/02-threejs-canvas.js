(function() {

    // Create a Canvas renderer

    var renderer = new THREE.WebGLRenderer({ antialias: true });

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
    camera.position.z = 500;

    scene.add( camera );

    // Let there be light

    var ambientLight = new THREE.AmbientLight( 0xDDDDDD );
    scene.add( ambientLight );

    // Cube

    //TODO

    // Animate

    var animate = function() {

        renderer.render( scene, camera );

        requestAnimationFrame( animate );

    };

})();
