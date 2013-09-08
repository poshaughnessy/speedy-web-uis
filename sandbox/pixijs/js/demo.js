var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

var stage,
    container,
    stats,
    objects = [],
    BLOCK_SIZE = 100,
    ORANGE = 0xf88d46,
    BLUE = 0x46e1f8,
    GREEN = 0x66cc66,
    YELLOW = 0xffcc33;

document.getElementById('container').appendChild(renderer.view);

stage = new PIXI.Stage(0xFFFFFF, true); // Set interactive = true

container = new PIXI.DisplayObjectContainer();

container.interactive = true;

container.width = window.innerWidth;
container.height = window.innerHeight;

stage.addChild(container);

var blocks = [];

function createBlock(id, colour, x, y) {

    blocks.push({
        id: id,
        colour: colour,
        x: x,
        y: y
    });

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

for( var i=0; i < 10; i++ ) {
    createBlock(11+i, ORANGE, BLOCK_SIZE * 4, BLOCK_SIZE * (5+i));
}

for( i=0; i < 10; i++ ) {
    createBlock(21+i, BLUE, BLOCK_SIZE * 5, BLOCK_SIZE * (5+i));
}

for( i=0; i < 10; i++ ) {
    createBlock(31+i, GREEN, BLOCK_SIZE * 6, BLOCK_SIZE * (5+i));
}

for( i=0; i < 10; i++ ) {
    createBlock(41+i, YELLOW, BLOCK_SIZE * 7, BLOCK_SIZE * (5+i));
}

// Stats
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild( stats.domElement );


// Create blocks

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

    // text label

    block.label = new PIXI.Text(''+block.id, {fill: '#FFFFFF'});

    block.label.position.x = 45;
    block.label.position.y = 35;

    graphics.addChild(block.label);

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

    container.addChild(graphics);

}

/*
var containerPosTargetX = 0;
var containerPosTargetY = 0;
*/

function centreBlock(block) {

    var tween = new TWEEN.Tween( container.position )
            .to( { x: 100 - block.x, y: 100 - block.y }, 500)
            .easing( TWEEN.Easing.Quadratic.InOut );

    tween.start();
    
    /*
    containerPosTargetX = 100 - block.x;
    containerPosTargetY = 100 - block.y;
    */

}

function animate() {

    renderer.render( stage );

    /*
    if( container.position.x < containerPosTargetX ) {
        container.position.x += Math.min(10, containerPosTargetX - container.position.x);

    } else if( container.position.x > containerPosTargetX ) {
        container.position.x -= Math.min(10, container.position.x - containerPosTargetX);
    }

    if( container.position.y < containerPosTargetY ) {
        container.position.y += Math.min(10, containerPosTargetY - container.position.y);

    } else if( container.position.y > containerPosTargetY ) {
        container.position.y -= Math.min(10, container.position.y - containerPosTargetY);
    }
    */

    TWEEN.update();

    stats.update();

    requestAnimFrame( animate );

}

animate();





// Stage interaction - scrolling

/*
 stage.touchstart = function(data) {
 console.log('stage touch start', data);
 };

 stage.touchend = function(data) {
 console.log('stage touch end', data);
 };

 stage.touchendoutside = function(data) {
 console.log('stage touch end outside', data);
 };

 stage.tap = function(data) {
 console.log('stage tap');
 };

 stage.click = function(data) {
 console.log('stage click');
 };

 stage.mousedown = function(data) {
 console.log('stage mouse down', data);
 };

 stage.mouseup = function(data) {
 console.log('stage mouse up', data);
 };

 stage.mouseupoutside = function(data) {
 console.log('stage mouse up outside', data);
 };
 */

/*
 container.touchstart = function(data) {
 console.log('container touch start', data);
 };

 container.touchend = function(data) {
 console.log('container touch end', data);
 };

 container.touchendoutside = function(data) {
 console.log('container touch end outside', data);
 };

 container.tap = function(data) {
 console.log('container tap');
 };

 container.click = function(data) {
 console.log('container click');
 };

 container.mousedown = function(data) {
 console.log('container mouse down', data);
 };

 container.mouseup = function(data) {
 console.log('container mouse up', data);
 };

 container.mouseupoutside = function(data) {
 console.log('container mouse up outside', data);
 };
 */

// Even trying to handle touch events manually isn't working
// touchcancel event is fired!

/*
 document.addEventListener("touchstart", onTouchStart);
 document.addEventListener("touchend", onTouchEnd);
 document.addEventListener("touchcancel", onTouchCancel);

 var touchX,
 touchY;

 function onTouchStart(event) {
 console.log('onTouchStart', event);
 }

 function onTouchEnd(event) {
 console.log('onTouchEnd', event);
 }

 function onTouchCancel(event) {
 console.log('onTouchCancel', event);
 }
 */
