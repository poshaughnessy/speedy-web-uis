var Demos = {

    // Demos add themselves here
    demos: [
        /*
        {
            id: 'threejs-webgl',
            constructor: function() {...},
            object: null
        }
        */
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