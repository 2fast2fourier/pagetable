
var game;

function loadInit(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
}

var introData = [
457,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,443,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
442,  2,  3,  4,  5,  6,  7,  8,  9, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 13, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,442,
456,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,461,444
];

var levelData = [
    introData
];


function preload() {

    game.load.image('bullet', 'assets/games/invaders/bullet.png');
    game.load.image('white32', 'white32.png');
    game.load.image('borderTop', 'bordertop.png');
    game.load.image('borderBottom', 'borderbottom.png');
    game.load.image('borderLeft', 'bordertop.png');
    game.load.image('borderRight', 'bordertop.png');
    game.load.spritesheet('termfont', 'font16.png', 16, 16);
    game.load.spritesheet('colorCircle16', 'colorCircle16.png', 16, 16);


}

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var WIDTH = 16;
var SCREENX = 48;
var OFFSETX = 16, OFFSETY = 12;

function p2x(pos){
    return pos%SCREENX;
}

function p2y(pos){
    return Math.floor(pos/SCREENX);
}

var player;
var level = introData;
var walls;
var text;
var background;
var arrows;
var fire;

function create() {
    background = game.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'white32');
    game.add.tileSprite(0, 0, SCREEN_WIDTH, 5, 'borderTop');
    game.add.tileSprite(0, SCREEN_HEIGHT-5, SCREEN_WIDTH, 5, 'borderBottom');
    game.add.tileSprite(0, 0, 5, SCREEN_HEIGHT, 'borderLeft');
    game.add.tileSprite(SCREEN_WIDTH-5, 0, 5, SCREEN_HEIGHT, 'borderRight');
    var x;

    text = game.add.group();
    text.enableBody = true;
    text.physicsBodyType = Phaser.Physics.ARCADE;
    text.createMultiple(level.length, 'termfont');
    text.setAll('anchor.x', 0.5);
    text.setAll('anchor.y', 0.5);
    text.forEach(function(pt){
        var pos = pt.z-1;
        if(level[pos] > 0){
            pt.reset(p2x(pos)*WIDTH+WIDTH/2+OFFSETX, p2y(pos)*WIDTH+WIDTH/2+OFFSETY);
            pt.frame = level[pos];
            pt.body.immovable = true;
        }
    });

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(400, 500, 'colorCircle16', 3);
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;
    walls.createMultiple(30, 'colorCircle16', 5);
    walls.setAll('anchor.x', 0.5);
    walls.setAll('anchor.y', 0.5);
    walls.setAll('body.immovable', true);
    walls.forEach(function(wall){
        var pos = wall.z;
        wall.reset(pos*16, pos*16);
    });

    arrows = game.input.keyboard.createCursorKeys();
    fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function update() {

    if (player.alive){
        player.body.velocity.setTo(0, 0);

        if (arrows.left.isDown){
            player.body.velocity.x = -200;
        }
        if (arrows.right.isDown){
            player.body.velocity.x = 200;
        }
        if (arrows.up.isDown){
            player.body.velocity.y = -200;
        }
        if (arrows.down.isDown){
            player.body.velocity.y = 200;
        }
        if (fire.isDown){
            fire();
        }

        game.physics.arcade.collide(text, player, collisionHandler);
        game.physics.arcade.collide(walls, player, collisionHandler);

        if(player.body.x > SCREEN_WIDTH){
            player.body.x = 0;
        }
        if(player.body.x < 0){
            player.body.x = SCREEN_WIDTH;
        }
        if(player.body.y > SCREEN_HEIGHT){
            player.body.y = 0;
        }
        if(player.body.y < 0){
            player.body.y = SCREEN_HEIGHT;
        }
    }

}

function render() {

}

function collisionHandler (wall, player) {

}

function restart () {

}


