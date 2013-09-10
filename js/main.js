require.config({

    paths: {
        colladaLoader: 'lib/ColladaLoader',
        css3dRenderer: 'lib/CSS3DRenderer',
        customTrackballControls: 'lib/CustomTrackballControls',
        helvetiker: 'lib/helvetiker_regular.typeface',
        jquery: 'lib/jquery-1.9.1',
        pixi: 'lib/pixi',
        stats: 'lib/stats.min',
        three: 'lib/three.min',
        trackballControls: 'lib/TrackballControls',
        tween: 'lib/tween.min'
    },

    shim: {
        colladaLoader: {
            deps: ['three']
        },
        css3dRenderer: {
            deps: ['three']
        },
        customTrackballControls: {
            deps: ['three']
        },
        helvetiker: {
            deps: ['three']
        },
        stats: {
            exports: 'Stats'
        },
        three: {
            exports: 'THREE'
        },
        trackballControls: {
            deps: ['three']
        },
        tween: {
            exports: 'TWEEN'
        }
    }

});

require(['demoController', 'slides'], function(Demos, Slides) {

    Demos.init();

    new Slides(Demos);

});
