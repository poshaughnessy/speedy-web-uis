Demos.demos.push(
        {
            id: 'threejs-webgl',

            constructor: function() {

                // Create a WebGL renderer

                var renderer = new THREE.WebGLRenderer({ antialias: true });

                // Add generated <canvas> to page

                var container = document.getElementById('container-webgl');

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
                camera.position.z = 500;

                scene.add( camera );

                // Let there be light

                var ambientLight = new THREE.AmbientLight( 0xDDDDDD );
                scene.add( ambientLight );

                // Dinosaur

                var loader = new THREE.JSONLoader();

                var mesh;

                loader.load('../../models/trex/trex.js', function(geometry, materials) {

                    mesh = new THREE.Mesh( geometry,
                            new THREE.MeshFaceMaterial( materials ) );

                    mesh.scale.set(10, 10, 10);
                    mesh.rotation.y = Math.PI / 2;
                    mesh.position.set( 0, 0, 0 );

                    scene.add( mesh );

                    animate();

                });

                var stopped = false;

                this.start = function() {
                    stopped = false;
                };

                this.stop = function() {
                    stopped = true;
                };

                // Animate

                var animate = function() {

                    if( !stopped ) {

                        mesh.rotation.y += 0.02;

                        renderer.render( scene, camera );

                    }

                    requestAnimationFrame( animate );

                };

            }
        });
