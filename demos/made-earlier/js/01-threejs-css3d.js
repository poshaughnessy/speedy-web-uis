(function() {

    // Create a CSS3D renderer

    var renderer = new THREE.CSS3DRenderer();

    // Add generated element to page

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

    camera.position.y = 100;
    camera.position.z = 800;

    scene.add( camera );

    // Create a block

    var createBlock = function(x, y, color) {

        var el = document.createElement('div');
        el.className = 'block';
        el.style.backgroundColor = color;

        var elTop = document.createElement('div');
        elTop.className = 'side top';
        el.appendChild( elTop );

        var elLeft = document.createElement('div');
        elLeft.className = 'side left';
        el.appendChild( elLeft );

        var elBottom = document.createElement('div');
        elBottom.className = 'side bottom';
        el.appendChild( elBottom );

        var elRight = document.createElement('div');
        elRight.className = 'side right';
        el.appendChild( elRight );

        var obj = new THREE.CSS3DObject( el );
        obj.position.set( x, y, 0 );
        scene.add( obj );

    };

    // Set up blocks

    var BLOCK_SIZE = 100;

    createBlock( 0, 0, '#f88d46' );
    createBlock( 0, BLOCK_SIZE, '#46e1f8' );
    createBlock( BLOCK_SIZE, BLOCK_SIZE, '#66cc66' );
    createBlock( 0, BLOCK_SIZE * 2, '#ffcc33' );

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
