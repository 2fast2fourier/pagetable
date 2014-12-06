
var game;

function loadInit(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
}

var destroyableWalls = [461,442];



function preload() {

    game.load.image('bullet', 'assets/games/invaders/bullet.png');
    game.load.image('white32', 'white32.png');
    game.load.image('borderTop', 'bordertop.png');
    game.load.image('borderBottom', 'borderbottom.png');
    game.load.image('borderLeft', 'bordertop.png');
    game.load.image('borderRight', 'bordertop.png');
    game.load.spritesheet('termfont', 'font16.png', 16, 16);
    game.load.spritesheet('colorCircle16', 'colorCircle16.png', 16, 16);

    game.load.json('leveldata', 'levels.json');


}

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var WIDTH = 16;
var SCREENX = 48;
var OFFSETX = 16, OFFSETY = 12;
var BULLET_VELOCITY = 300;
var BULLET_DELAY = 250;

function p2x(pos){
    return pos%SCREENX;
}

function p2y(pos){
    return Math.floor(pos/SCREENX);
}

var levelData;
var player;
var level;
var walls;
var text;
var background;
var controls;
var fire;
var bulletDelay = 0;
var paused = false;
var bulletGroup, textGroup, playerGroup;

function create() {
    levelData = game.cache.getJSON('leveldata') || {data: [{}]};
    level = levelData.data[0];
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    bulletGroup = game.physics.p2.createCollisionGroup();
    playerGroup = game.physics.p2.createCollisionGroup();
    textGroup = game.physics.p2.createCollisionGroup();
    // game.physics.p2.updateBoundsCollisionGroup();

    background = game.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'white32');

    game.add.tileSprite(0, 0, SCREEN_WIDTH, 5, 'borderTop');
    game.add.tileSprite(0, SCREEN_HEIGHT-5, SCREEN_WIDTH, 5, 'borderBottom');
    game.add.tileSprite(0, 0, 5, SCREEN_HEIGHT, 'borderLeft');
    game.add.tileSprite(SCREEN_WIDTH-5, 0, 5, SCREEN_HEIGHT, 'borderRight');
    var x;

    text = game.add.group();
    text.createMultiple(level.length, 'termfont');
    game.physics.p2.enable(text);
    text.setAll('body.static', true);
    text.setAll('body.fixedRotation', true);
    text.forEach(function(pt){
        var pos = pt.z-1;
        pt.body.setCollisionGroup(textGroup);
        pt.body.collides([playerGroup, bulletGroup]);
        if(level[pos] > 0){
            pt.reset(p2x(pos)*WIDTH+WIDTH/2+OFFSETX, p2y(pos)*WIDTH+WIDTH/2+OFFSETY);
            pt.frame = level[pos];
        }
    });

    player = game.add.sprite(400, 500, 'termfont', 383);
    player.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(player);
    player.body.setCircle(8);
    player.body.fixedRotation = true;
    player.body.setCollisionGroup(playerGroup);
    player.body.collides(textGroup);

    // walls = game.add.group();
    // walls.enableBody = true;
    // walls.physicsBodyType = Phaser.Physics.ARCADE;
    // walls.createMultiple(30, 'colorCircle16', 5);
    // walls.setAll('anchor.x', 0.5);
    // walls.setAll('anchor.y', 0.5);
    // walls.setAll('body.immovable', true);
    // walls.forEach(function(wall){
    //     var pos = wall.z;
    //     wall.reset(pos*16, pos*16);
    // });

    bullets = game.add.group();
    bullets.createMultiple(20, 'termfont', 254);
    game.physics.p2.enable(bullets, true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.forEach(function(bullet){
        bullet.body.setCircle(4);
        bullet.body.setCollisionGroup(bulletGroup);
        bullet.body.collides(textGroup, bulletHitText);
    });

    controls = game.input.keyboard.createCursorKeys();
    fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function update() {

    if (!paused && player.alive){
        player.body.setZeroVelocity();

        if (controls.left.isDown){
            player.body.moveLeft(200);
            player.rotation = 1.5*Math.PI;
        }
        if (controls.right.isDown){
            player.body.moveRight(200);
            player.rotation = Math.PI/2;
        }
        if (controls.up.isDown){
            player.body.moveUp(200);
            player.rotation = 0;
        }
        if (controls.down.isDown){
            player.body.moveDown(200);
            player.rotation = Math.PI;
        }
        if (fire.isDown){
            playerFire();
        }

        // game.physics.arcade.collide(text, player, collisionHandler);
        // game.physics.arcade.collide(walls, player, collisionHandler);

        // game.physics.arcade.overlap(bullets, enemies, bulletHit);
        // game.physics.arcade.overlap(bullets, text, bulletHitText);

        // if(player.body.x > SCREEN_WIDTH){
        //     player.body.x = 0;
        // }
        // if(player.body.x < 0){
        //     player.body.x = SCREEN_WIDTH;
        // }
        // if(player.body.y > SCREEN_HEIGHT){
        //     player.body.y = 0;
        // }
        // if(player.body.y < 0){
        //     player.body.y = SCREEN_HEIGHT;
        // }


        bullets.forEachAlive(function(bullet){
            if(bullet.reclaim < game.time.now){
                bullet.kill();
            }
        });
    }

}

function render() {

}

function collisionHandler(wall, player) {

}

function bulletHitText(bullet, text) {
    bullet.sprite.kill();
    // var wallType = wall.frame;
    // console.log('hit', wallType);
    text.sprite.kill();

}

function playerFire(){
    if (game.time.now > bulletDelay){
        bullet = bullets.getFirstExists(false);
        if (bullet){
            bullet.reset(player.x, player.y);
            bullet.body.fixedRotation = false;
            bullet.body.rotation = player.rotation;
            bullet.body.moveForward(BULLET_VELOCITY);
            bullet.body.fixedRotation = true;
            bullet.reclaim = game.time.now + 5000;
            bulletDelay = game.time.now + BULLET_DELAY;
            // bullet.body.setSize(8,8,0,0);
        }
    }
}

function restart() {

}

function deg2rad(deg){
    return deg*(Math.PI/180);
}

function rad2deg(rad){
    return rad*(180/Math.PI);
}


