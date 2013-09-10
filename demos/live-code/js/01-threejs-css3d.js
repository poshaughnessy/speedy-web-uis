(function() {

    // Create a CSS3D renderer

    var renderer = new THREE.CSS3DRenderer();

    // Add generated element to page

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Dimensions for renderer

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    renderer.setSize( width, height );

    // Make a scene

    var scene = new THREE.Scene();

    // Camera, position and add to scene

    var camera = new THREE.PerspectiveCamera(
            45, // Field of View
            width / height, // Aspect ratio
            1, // zNear
            10000 // zFar

    );

    camera.position.z = 1000;

    scene.add(camera);

    // Create a block

    function createBlock(x, y, colour) {

        var el = document.createElement('div');
        el.className = 'block';
        el.style.backgroundColor = colour;

        var elTop = document.createElement('div');
        elTop.className = 'side top';
        el.appendChild(elTop);

        var elRight = document.createElement('div');
        elRight.className = 'side right';
        el.appendChild(elRight);

        var elBottom = document.createElement('div');
        elBottom.className = 'side bottom';
        el.appendChild(elBottom);

        var elLeft = document.createElement('div');
        elLeft.className = 'side left';
        el.appendChild(elLeft);

        var object = new THREE.CSS3DObject(el);
        object.position.x = x;
        object.position.y = y;

        scene.add( object );

    }

    // Set up blocks

    var BLOCK_SIZE = 100;

    createBlock(0, 0, 'blue');
    createBlock(0, -BLOCK_SIZE, 'indigo');
    createBlock(BLOCK_SIZE, -BLOCK_SIZE, 'black');

    // Controls

    var controls = new THREE.TrackballControls(camera,  renderer.domElement);

    // Animate

    function animate() {

        renderer.render(scene, camera);

        requestAnimationFrame(animate);

        controls.update();


    }

    animate();

})();
