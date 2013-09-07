var CAMERA_POS_DEFAULT = {x: 0, y: -180, z: 1000},
    CAMERA_FALL_START_Z = 3000,
    BLOCK_SIZE = 180,
    BLOCK_MARGIN = 30;

var camera,
    scene,
    renderer,
    controls,
    stats,
    objects = [];

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );

    camera.position.x = CAMERA_POS_DEFAULT.x;
    camera.position.y = CAMERA_POS_DEFAULT.y;
    camera.position.z = CAMERA_FALL_START_Z;

    // Keep camera rotation static
    camera.rotationAutoUpdate = false;

    scene = new THREE.Scene();

    setupBlocks();

    setupInitialAnimation();

    setupBlockClicks();

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.noRotate = true;
    controls.noPan = false;
    controls.panSpeed = 0.3;
    controls.zoomSpeed = 1.0;

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.right = '0px';
    document.getElementById('container').appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    $('a.close').click(function() {

        var cameraZoomOutTween = new TWEEN.Tween( camera.position )
                .to( { z: CAMERA_POS_DEFAULT.z, y: camera.position.y - 90 }, 1000)
                .easing( TWEEN.Easing.Quadratic.In);

        cameraZoomOutTween.start();

        $('#container').removeClass('grey');

        $('.quiz').fadeOut('fast');
    });

}

function setupBlocks() {

    createBlockObject( -BLOCK_SIZE - BLOCK_MARGIN, 0, 'orange', 'leftarrow', '←' );

    createBlockObject( -BLOCK_SIZE - BLOCK_MARGIN, -BLOCK_SIZE - BLOCK_MARGIN, 'yellow' );

    createBlockObject( 0, 0, 'blue', null, '<img src="img/profile.png">' );

    createBlockObject( 0, -BLOCK_SIZE - BLOCK_MARGIN, 'green', 'downarrow', '↓' );

    createBlockObject( BLOCK_SIZE + BLOCK_MARGIN, -BLOCK_SIZE - BLOCK_MARGIN, 'orange' );

    createBlockObject( 2 * (BLOCK_SIZE + BLOCK_MARGIN), -BLOCK_SIZE - BLOCK_MARGIN, 'blue' );

    createBlockObject( 0, -2 * (BLOCK_SIZE + BLOCK_MARGIN), 'yellow' );

    createBlockObject( 0, -3 * (BLOCK_SIZE + BLOCK_MARGIN), 'blue' );

    createBlockObject( BLOCK_SIZE + BLOCK_MARGIN, -3 * (BLOCK_SIZE + BLOCK_MARGIN), 'green' );

    createBlockObject( BLOCK_SIZE + BLOCK_MARGIN, -4 * (BLOCK_SIZE + BLOCK_MARGIN), 'yellow' );

    // Right, let's create *loads* of blocks...

    for( var i=0; i < 10; i++ ) {
        createBlockObject( 0, (-4-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'blue' );
    }

    for( i=0; i < 10; i++ ) {
        createBlockObject( BLOCK_SIZE + BLOCK_MARGIN, (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'yellow' );
    }

    for( i=0; i < 10; i++ ) {
        createBlockObject( 2 * (BLOCK_SIZE + BLOCK_MARGIN), (-4-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'green' );
    }

    for( i=0; i < 20; i++ ) {
        createBlockObject( 3 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'orange' );
    }

    for( i=0; i < 20; i++ ) {
        createBlockObject( 4 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'blue' );
    }

    for( i=0; i < 20; i++ ) {
        createBlockObject( 5 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), 'yellow' );
    }


}

function setupInitialAnimation() {

    var cameraFallTween = new TWEEN.Tween( camera.position )
            .to( { z: CAMERA_POS_DEFAULT.z }, 2000)
            .easing( TWEEN.Easing.Quadratic.InOut );

    cameraFallTween.start();

}

function setupBlockClicks() {

    for( var i=0; i < objects.length; i++ ) {

        var obj = objects[i];

        var el = obj.element;

        $(el).click(function(obj) {
            return function() {

                if( cameraFocusedOnBlock(obj) ) {

                    // Dive in...

                    // XXX Eugh, duplicated from CSS...
                    var colour = '#46e1f8';
                    if( obj.data.colour === 'orange' ) {
                        colour = '#f88d46';
                    } else if( obj.data.colour === 'green' ) {
                        colour = '#66cc66';
                    } else if( obj.data.colour === 'yellow' ) {
                        colour = '#ffcc33';
                    }

                    $('#container').addClass('grey');

                    var cameraZoomTween = new TWEEN.Tween( camera.position )
                            .to( { z: 5, y: obj.position.y }, 1000)
                            .easing( TWEEN.Easing.Quadratic.In);

                    cameraZoomTween.start();

                } else {

                    animateBlockPress(obj);
                    centerBlock(obj);

                }

            }
        }(obj));

    }

}

function animateBlockPress(object) {

    var tween = new TWEEN.Tween( object.position )
            .to( { z: -80 }, 250 )
            .easing( TWEEN.Easing.Quadratic.In );

    var tweenBack = new TWEEN.Tween( object.position )
            .to( { z: 0 }, 250 )
            .easing( TWEEN.Easing.Quadratic.In );

    console.log('camera rotation', camera.rotation);

    tween.chain( tweenBack );

    tween.start();

}

function centerBlock(object) {

    console.log('object', object);

    var tween = new TWEEN.Tween( camera.position )
            .to( { x: object.position.x, y: object.position.y - 90, z: CAMERA_POS_DEFAULT.z }, 500)
            .easing( TWEEN.Easing.Quadratic.InOut );

    tween.start();

}

function cameraFocusedOnBlock(object) {

    var THRESHOLD = 1;

    return (camera.position.z <= CAMERA_POS_DEFAULT.z + THRESHOLD) &&
           (camera.position.x >= object.position.x - THRESHOLD) &&
           (camera.position.x <= object.position.x + THRESHOLD) &&
           (camera.position.y >= object.position.y - 90 - THRESHOLD) &&
           (camera.position.y <= object.position.y - 90 + THRESHOLD);


}

function createBlockObject( x, y, colour, extraClasses, innerHTML ) {

    var classes = 'block';
    if( colour ) classes += ' ' + colour;
    if( extraClasses ) classes += ' ' + extraClasses;

    var el = createBlockElement('div', classes, innerHTML );

    var obj = new THREE.CSS3DObject( el );
    obj.position.set( x, y, 0 );
    // XXX temp hack - will prob need our own object representation
    obj.data = {colour: colour};

    objects.push( obj );
    scene.add( obj );

}


function createBlockElement( elType, elClass, elHTML ) {

    var el = document.createElement(elType);
    el.className = elClass;
    if( elHTML ) el.innerHTML = elHTML;

    addBlockSides( el );

    return el;
}

function addBlockSides(parentElement) {

    var elTop = document.createElement('div');
    elTop.className = 'side top';
    parentElement.appendChild( elTop );

    var elLeft = document.createElement('div');
    elLeft.className = 'side left';
    parentElement.appendChild( elLeft );

    var elBottom = document.createElement('div');
    elBottom.className = 'side bottom';
    parentElement.appendChild( elBottom );

    var elRight = document.createElement('div');
    elRight.className = 'side right';
    parentElement.appendChild( elRight );

}

function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();

    controls.update();

    stats.update();

    renderer.render( scene, camera );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}