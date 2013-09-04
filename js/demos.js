var Demos = {

    width: 0,
    height: 0,

    activationFlags: {
        leapMotionDino: false
    },

    onSlide: function(slideNumber) {

        this.stopDemos();

        var $currentSlide = $('.slide:eq('+slideNumber+')');

        if( $currentSlide.hasClass('leapmotion-dino') ) {
            this.activationFlags.leapMotionDino = true;

        } else if( $currentSlide.hasClass('leapmotion-dino') ) {
            this.longJumpDemo.start();
        }

    },

    stopDemos: function() {

        for( var flagKey in this.activationFlags ) {
            if( this.activationFlags.hasOwnProperty(flagKey) ) {
                this.activationFlags[flagKey] = false;
            }
        }

    },

    init: function() {

        this.setSize();

        console.log('width', this.width);
        console.log('height', this.height);

        this.leapMotionDino = new LeapMotionDinoDemo(this);

        this.longJumpDemo = new LongJumpDemo(this);

        var self = this;

        window.addEventListener( 'resize', function() {

            self.setSize();

            if( self.leapMotionDino ) {
                self.leapMotionDino.updateSize();
            }

        }, false );

    },

    setSize: function() {

        // Set demo size
        var $slideContents = $('.slide .contents');
        this.width = $slideContents.width();
        this.height = $slideContents.height();

        console.log('width', this.width);
        console.log('height', this.height);

    }

};
