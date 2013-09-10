define([
    'jquery',
    'demos/threejs-canvas',
    'demos/threejs-canvas-text',
    'demos/threejs-css3d',
    'demos/threejs-css3d-100',
    'demos/threejs-webgl',
    'demos/threejs-webgl-dino',
    'demos/threejs-webgl-robot'
], function($, demo1, demo2, demo3, demo4, demo5, demo6, demo7) {

    var DemoController = {

        demos: [
            demo1,
            demo2,
            demo3,
            demo4,
            demo5,
            demo6,
            demo7
        ],

        onSlide: function(slideNumber) {

            this.stopDemos();

            var $currentSlide = $('.slide:eq('+slideNumber+')');

            for( var i=0; i < this.demos.length; i++ ) {

                var demo = this.demos[i];

                if( $currentSlide.hasClass( demo.id ) ) {

                    if( demo.object ) {
                        if( typeof demo.object.start !== 'undefined' ) {
                            demo.object.start();
                        }
                    } else {
                        var constructor = demo.constructor;
                        demo.object = new constructor();
                    }

                }

            }

        },

        stopDemos: function() {

            for( var i=0; i < this.demos.length; i++ ) {

                var demo = this.demos[i];

                if( demo.object ) {
                    if( typeof demo.object.stop !== 'undefined' ) {
                        demo.object.stop();
                    }
                }

            }

        },

        init: function() {

            window.addEventListener( 'resize', function() {

                // TODO tell demos to update size

            }, false );

        }

    };

    return DemoController;

});

