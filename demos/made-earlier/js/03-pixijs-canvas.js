(function() {

    var stage,
        container,
        stats,
        blocks = [],
        BLOCK_SIZE = 100,
        ORANGE = 0xf88d46,
        BLUE = 0x46e1f8,
        GREEN = 0x66cc66,
        YELLOW = 0xffcc33;


    var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

    document.getElementById('container').appendChild(renderer.view);


    stage = new PIXI.Stage(0xFFFFFF, true); // interactive = true

    container = new PIXI.DisplayObjectContainer();

    container.interactive = true;
    container.width = window.innerWidth;
    container.height = window.innerHeight;

    stage.addChild(container);


    function createBlock(id, colour, x, y) {

        blocks.push({
            id: id,
            colour: colour,
            x: x,
            y: y
        });

    }

    function centreBlock(block) {

        var tween = new TWEEN.Tween( container.position )
                .to( { x: 100 - block.x, y: 100 - block.y }, 500)
                .easing( TWEEN.Easing.Quadratic.InOut );

        tween.start();

    }

    createBlock(1, ORANGE, BLOCK_SIZE, BLOCK_SIZE);
    createBlock(2, BLUE, BLOCK_SIZE * 2, BLOCK_SIZE);
    createBlock(3, GREEN, BLOCK_SIZE * 2, BLOCK_SIZE * 2);
    createBlock(4, YELLOW, BLOCK_SIZE * 2, BLOCK_SIZE * 3);
    createBlock(5, ORANGE, BLOCK_SIZE * 3, BLOCK_SIZE * 3);
    createBlock(6, BLUE, BLOCK_SIZE * 3, BLOCK_SIZE * 4);
    createBlock(7, GREEN, BLOCK_SIZE * 4, BLOCK_SIZE * 4);
    createBlock(8, YELLOW, BLOCK_SIZE * 5, BLOCK_SIZE * 4);
    createBlock(9, ORANGE, BLOCK_SIZE * 6, BLOCK_SIZE * 4);
    createBlock(10, BLUE, BLOCK_SIZE * 7, BLOCK_SIZE * 4);

    for( var i=0; i < 20; i++ ) {
        createBlock(11+i, ORANGE, BLOCK_SIZE * 4, BLOCK_SIZE * (5+i));
    }

    for( i=0; i < 20; i++ ) {
        createBlock(31+i, BLUE, BLOCK_SIZE * 5, BLOCK_SIZE * (5+i));
    }

    for( i=0; i < 20; i++ ) {
        createBlock(51+i, GREEN, BLOCK_SIZE * 6, BLOCK_SIZE * (5+i));
    }

    for( i=0; i < 30; i++ ) {
        createBlock(71+i, YELLOW, BLOCK_SIZE * 7, BLOCK_SIZE * (5+i));
    }

    // Set up blocks

    for( i=0; i < blocks.length; i++ ) {

        var block = blocks[i];

        var graphics = block.graphics = new PIXI.Graphics();

        graphics.clear();

        graphics.position.x = block.x;
        graphics.position.y = block.y;

        graphics.beginFill(block.colour, 1);

        graphics.moveTo(0, 0);

        graphics.lineTo(BLOCK_SIZE, 0);
        graphics.lineTo(BLOCK_SIZE, BLOCK_SIZE);
        graphics.lineTo(0, BLOCK_SIZE);
        graphics.lineTo(0, 0);

        graphics.endFill();

        // click

        graphics.interactive = true;

        graphics.mousedown = graphics.touchstart = function(data) {
            this.alpha = 0.5;
        };

        graphics.mouseup = graphics.touchend = function(data) {
            this.alpha = 1;
        };

        graphics.click = (function(block) {
            return function(data){
                console.log("click", block);
                centreBlock(block);
            };
        })(block);

        graphics.tap = (function(block) {
            return function(data){
                console.log("tap", block);
                centreBlock(block);
            };
        })(block);

        // text label

        block.label = new PIXI.Text(''+block.id, {fill: '#FFFFFF'});

        block.label.position.x = 45;
        block.label.position.y = 35;

        graphics.addChild(block.label);


        container.addChild(graphics);

    }


    // Stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('container').appendChild( stats.domElement );


    function animate() {

        renderer.render( stage );

        TWEEN.update();

        stats.update();

        requestAnimFrame( animate );

    }

    animate();

})();