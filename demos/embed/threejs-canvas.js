Demos.demos.push(
        {
            id: 'threejs-canvas',

            constructor: function() {

                // Create a Canvas renderer

                var renderer = new THREE.CanvasRenderer();

                // Add generated <canvas> to page

                var container = document.getElementById('container-canvas');

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

                scene.add( camera );

                // Let there be light

                var ambientLight = new THREE.AmbientLight( 0xDDDDDD );
                scene.add( ambientLight );

                // Create a block

                var createBlock = function( x, y, colorHex ) {

                    var geometry = new THREE.CubeGeometry( 100, 100, 50 );

                    var color = new THREE.Color(colorHex);

                    var material = new THREE.MeshBasicMaterial({ color: color });

                    var object = new THREE.Mesh( geometry, material );

                    object.position.set( x, y, 0 );

                    scene.add( object );

                };

                // Set up blocks

                var BLOCK_SIZE = 100;

                createBlock( 0, 0, 0xf88d46 );
                createBlock( 0, BLOCK_SIZE, 0x46e1f8 );
                createBlock( BLOCK_SIZE, BLOCK_SIZE, 0x66cc66 );
                createBlock( 0, BLOCK_SIZE * 2, 0xffcc33 );

                // Controls

                var controls = new THREE.TrackballControls( camera, renderer.domElement );

                // Stats

                var stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.bottom = '0px';
                stats.domElement.style.right = '0px';
                container.appendChild( stats.domElement );

                // Animate

                var stopped = false;

                this.start = function() {
                    stopped = false;
                    animate();
                };

                this.stop = function() {
                    stopped = true;
                };

                var animate = function() {

                    if( stopped ) {
                        return;
                    }

                    renderer.render( scene, camera );

                    requestAnimationFrame( animate );

                    controls.update();

                    stats.update();

                };

                animate();

            }
        });
