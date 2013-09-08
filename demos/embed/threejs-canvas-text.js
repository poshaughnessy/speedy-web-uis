Demos.demos.push(
        {
            id: 'threejs-canvas-text',

            constructor: function() {


                var CAMERA_POS_DEFAULT = {x: 0, y: -180, z: 1000},
                    BLOCK_SIZE = 180,
                    BLOCK_MARGIN = 30,
                    NEAR = 1,
                    FAR = 5000;

                var container,
                    camera,
                    scene,
                    renderer,
                    controls,
                    stats,
                    blocks = {},
                    blocksByColour = {},
                    meshes = [],
                    projector,
                    textMaterial,
                    textLabels = [],
                    textMergedGeo,
                    stopped = false;

                var BLOCK_COLOURS = {
                    ORANGE : {
                        PRIMARY: 0xf88d46,
                        SECONDARY: 0xda732d,
                        CSS: '#f88d46'
                    },
                    BLUE : {
                        PRIMARY: 0x46e1f8,
                        SECONDARY: 0x00bed5,
                        CSS: '#46e1f8'
                    },
                    GREEN : {
                        PRIMARY: 0x66cc66,
                        SECONDARY: 0x339966,
                        CSS: '#66cc66'
                    },
                    YELLOW : {
                        PRIMARY: 0xffcc33,
                        SECONDARY: 0xffb533,
                        CSS: '#ffcc33'
                    }
                };

                init();
                animate();

                function init() {

                    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, NEAR, FAR );

                    camera.position.x = CAMERA_POS_DEFAULT.x;
                    camera.position.y = CAMERA_POS_DEFAULT.y;
                    camera.position.z = CAMERA_POS_DEFAULT.z;

                    // Keep camera rotation static
                    camera.rotationAutoUpdate = false;

                    scene = new THREE.Scene();

                    projector = new THREE.Projector();

                    textMergedGeo = new THREE.Geometry();

                    textMaterial = new THREE.MeshBasicMaterial();

                    for( var i=0; i < 16; i++ ) {

                        var labelShapes = THREE.FontUtils.generateShapes(''+i, {
                            font: 'helvetiker',
                            weight: 'normal',
                            size: 20
                        });

                        var labelGeo = new THREE.ShapeGeometry( labelShapes );
                        textLabels[i] = new THREE.Mesh( labelGeo, textMaterial );

                    }

                    setupBlocks();

                    for( var idx in blocks ) {

                        if( blocks.hasOwnProperty(idx) ) {

                            var block = blocks[idx];

                            if( !blocksByColour[block.color.CSS] ) {
                                blocksByColour[block.color.CSS] = [];
                            }
                            blocksByColour[block.color.CSS].push(block);

                            var objAbove = block.objectAbove;

                            if( objAbove ) {
                                THREE.GeometryUtils.merge(textMergedGeo, objAbove );
                            }

                        }
                    }

                    for( var clr in blocksByColour ) {

                        if( blocksByColour.hasOwnProperty(clr) ) {

                            var blocksMergedGeo = new THREE.Geometry();

                            var blocksForColor = blocksByColour[clr];

                            for( i=0; i < blocksForColor.length; i++ ) {

                                var aBlock = blocksForColor[i];

                                THREE.GeometryUtils.merge(blocksMergedGeo, aBlock.mesh);

                            }

                            var blockGroup = new THREE.Mesh(blocksMergedGeo, blocksForColor[0].mesh.material );
                            blockGroup.matrixAutoUpdate = false;
                            blockGroup.matrixWorldNeedsUpdate = false;
                            blockGroup.rotationAutoUpdate = false;
                            blockGroup.updateMatrix();
                            scene.add(blockGroup);

                        }

                    }

                    var group = new THREE.Mesh(textMergedGeo, textMaterial );
                    group.matrixAutoUpdate = false;
                    group.updateMatrix();
                    group.matrixWorldNeedsUpdate = false;
                    group.rotationAutoUpdate = false;
                    scene.add(group);

                    container = document.getElementById('container-canvas-text');

                    setupBlockClicks();

                    renderer = new THREE.CanvasRenderer();

                    renderer.setSize( container.offsetWidth, container.offsetHeight );
                    container.appendChild(renderer.domElement);

                    controls = new THREE.CustomTrackballControls( camera, renderer.domElement );
                    controls.noRotate = true;
                    controls.noPan = false;
                    controls.staticMoving = true;
                    controls.panSpeed = 1.0;
                    controls.zoomSpeed = 1.0;
                    controls.tapCallback = onTap;

                    stats = new Stats();
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.bottom = '0px';
                    stats.domElement.style.right = '0px';
                    container.appendChild( stats.domElement );

                    window.addEventListener( 'resize', onWindowResize, false );

                }

                function setupBlocks() {

                    createBlockObject( 0, -BLOCK_SIZE - BLOCK_MARGIN, 0, BLOCK_COLOURS.ORANGE, '←' );

                    createBlockObject( 1, -BLOCK_SIZE - BLOCK_MARGIN, -BLOCK_SIZE - BLOCK_MARGIN, BLOCK_COLOURS.YELLOW );

                    createBlockObject( 2, 0, 0, BLOCK_COLOURS.BLUE, true );

                    createBlockObject( 3, 0, -BLOCK_SIZE - BLOCK_MARGIN, BLOCK_COLOURS.GREEN, '↓' );

                    createBlockObject( 4, BLOCK_SIZE + BLOCK_MARGIN, -BLOCK_SIZE - BLOCK_MARGIN, BLOCK_COLOURS.ORANGE );

                    createBlockObject( 5, 2 * (BLOCK_SIZE + BLOCK_MARGIN), -BLOCK_SIZE - BLOCK_MARGIN, BLOCK_COLOURS.BLUE );

                    createBlockObject( 6, 0, -2 * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.YELLOW );

                    createBlockObject( 7, 0, -3 * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.BLUE );

                    createBlockObject( 8, BLOCK_SIZE + BLOCK_MARGIN, -3 * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.GREEN );

                    createBlockObject( 9, BLOCK_SIZE + BLOCK_MARGIN, -4 * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.YELLOW );

                    // Right, let's create *loads* of blocks...

                    for( var i=0; i < 10; i++ ) {
                        createBlockObject( 10, 0, (-4-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.BLUE );
                    }

                    for( i=0; i < 10; i++ ) {
                        createBlockObject( 11, BLOCK_SIZE + BLOCK_MARGIN, (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.YELLOW );
                    }

                    for( i=0; i < 10; i++ ) {
                        createBlockObject( 12, 2 * (BLOCK_SIZE + BLOCK_MARGIN), (-4-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.GREEN );
                    }

                    for( i=0; i < 20; i++ ) {
                        createBlockObject( 13, 3 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.ORANGE );
                    }

                    for( i=0; i < 20; i++ ) {
                        createBlockObject( 14, 4 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.BLUE );
                    }

                    for( i=0; i < 20; i++ ) {
                        createBlockObject( 15, 5 * (BLOCK_SIZE + BLOCK_MARGIN), (-5-i) * (BLOCK_SIZE + BLOCK_MARGIN), BLOCK_COLOURS.YELLOW );
                    }


                }

                function setupBlockClicks() {

                    $(container).click(onMouseDown);

                }

                function animateBlockPress(blockItem) {

                    var object = blockItem.mesh;

                    animateBlockPressTween(object);

                    var objectAbove = blockItem.objectAbove;

                    if( objectAbove ) {
                        animateBlockPressTween(objectAbove);
                    }

                }

                function animateBlockPressTween(object) {

                    var originalZ = object.position.z;

                    var tween = new TWEEN.Tween( object.position )
                            .to( { z: object.position.z - 80 }, 250 )
                            .easing( TWEEN.Easing.Quadratic.In );

                    var tweenBack = new TWEEN.Tween( object.position )
                            .to( { z: originalZ }, 250 )
                            .easing( TWEEN.Easing.Quadratic.In );

                    tween.chain( tweenBack );

                    tween.start();

                }

                function centerBlock(object) {

                    console.log('centre object', object);

                    var tween = new TWEEN.Tween( camera.position )
                            .to( { x: object.position.x, y: object.position.y - 90, z: CAMERA_POS_DEFAULT.z }, 500)
                            .easing( TWEEN.Easing.Quadratic.InOut );

                    tween.start();

                    camera.position.set( object.position.x, object.position.y - 90, CAMERA_POS_DEFAULT.z );

                }

                function createBlockObject( blockNumber, x, y, blockColour, temp ) {

                    if( !blockColour ) blockColour = BLOCK_COLOURS.BLUE;

                    var frontMaterial = new THREE.MeshBasicMaterial({ color: blockColour.PRIMARY });
                    var sidesMaterial = new THREE.MeshBasicMaterial({ color: blockColour.SECONDARY });

                    var materials = [
                        sidesMaterial, // Left
                        sidesMaterial, // Right
                        sidesMaterial, // Top
                        sidesMaterial, // Bottom
                        frontMaterial, // Front
                        sidesMaterial // Back
                    ];

                    var geometry = new THREE.CubeGeometry( 180, 180, 100 );

                    var obj = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );

                    obj.position.set( x, y, 0 );

                    meshes.push( obj );

                    // So we can pull out block item by its ID
                    blocks[obj.id] = {
                        id: obj.id,
                        color: blockColour,
                        mesh: obj
                    };

                    obj.position.set( x, y, 0 );

                    meshes.push( obj );

                    // So we can pull out block item by its ID
                    blocks[obj.id] = {
                        id: obj.id,
                        color: blockColour,
                        mesh: obj
                    };

                    var labelMesh = new THREE.Mesh( textLabels[blockNumber].geometry, textLabels[blockNumber].material );

                    labelMesh.position.set( x, y, 51 );

                    blocks[obj.id].objectAbove = labelMesh;

                    scene.add( labelMesh );

                    scene.add( obj );

                }

                this.start = function() {
                    stopped = false;
                    animate();
                };

                this.stop = function() {
                    stopped = true;
                };

                function animate() {

                    if( stopped ) {
                        return;
                    }

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

                function onMouseDown(event) {

                    handleClickOrTap({x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight});

                    event.preventDefault();

                }

                function onTap(tapPosition) {

                    handleClickOrTap(tapPosition);

                }

                function handleClickOrTap(relativePosition) {

                    var vector = new THREE.Vector3(
                            ( relativePosition.x ) * 2 - 1,
                            - ( relativePosition.y ) * 2 + 1,
                            0.5 );

                    projector.unprojectVector( vector, camera );

                    var ray = new THREE.Raycaster( camera.position,
                            vector.sub( camera.position ).normalize(), NEAR, FAR );

                    var intersects = ray.intersectObjects( meshes );

                    if ( intersects.length > 0 ) {

                        var hitMesh = intersects[0].object;

                        console.log(hitMesh);

                        var blockItem = blocks[hitMesh.id];

                        console.log(blockItem);

                        animateBlockPress(blockItem);
                        centerBlock(hitMesh);

                    }

                }

            }

        });