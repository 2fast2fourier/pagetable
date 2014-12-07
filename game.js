
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

    game.load.json('leveldata', 'leveldata.json');

    game.load.audio('sfxFire', 'fire.wav');
    game.load.audio('sfxExplosion', 'explosion.wav');
    game.load.audio('sfxEnemyDie', 'enemydie.wav');


}

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var WIDTH = 16;
var SCREENX = 48;
var OFFSETX = 16, OFFSETY = 12;
var BULLET_VELOCITY = 300;
var BULLET_DELAY = 200;

function p2x(pos){
    return pos%SCREENX;
}

function p2y(pos){
    return Math.floor(pos/SCREENX);
}

var levelData;
var player;
var level;
var levelNumber = 0;
var levelCols = 3;
var levelCount;
var walls;
var text;
var background;
var controls;
var fire;
var bulletDelay = 0;
var paused = false;
var bulletGroup, textGroup, playerGroup, enemyGroup, enemyBulletGroup;
var sfxFire, sfxExplosion, sfxEnemyDie;
var bullets, enemyBullets, healthHUD;

function create() {
    levelData = game.cache.getJSON('leveldata');
    levelCount = levelData.data.length;
    level = levelData.data[levelNumber];

    sfxFire = game.add.audio('sfxFire');
    sfxExplosion = game.add.audio('sfxExplosion');
    sfxEnemyDie = game.add.audio('sfxEnemyDie');
    sfxFire.allowMultiple = true;
    sfxExplosion.allowMultiple = true;
    sfxEnemyDie.allowMultiple = true;

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    bulletGroup = game.physics.p2.createCollisionGroup();
    playerGroup = game.physics.p2.createCollisionGroup();
    textGroup = game.physics.p2.createCollisionGroup();
    enemyGroup = game.physics.p2.createCollisionGroup();
    enemyBulletGroup = game.physics.p2.createCollisionGroup();
    // game.physics.p2.updateBoundsCollisionGroup();

    background = game.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'white32');

    game.add.tileSprite(0, 0, SCREEN_WIDTH, 5, 'borderTop');
    game.add.tileSprite(0, SCREEN_HEIGHT-5, SCREEN_WIDTH, 5, 'borderBottom');
    game.add.tileSprite(0, 0, 5, SCREEN_HEIGHT, 'borderLeft');
    game.add.tileSprite(SCREEN_WIDTH-5, 0, 5, SCREEN_HEIGHT, 'borderRight');

    text = game.add.group();
    text.createMultiple(level.length, 'termfont');
    game.physics.p2.enable(text);
    text.setAll('body.static', true);
    text.setAll('body.fixedRotation', true);
    text.forEach(function(pt){
        pt.body.setCollisionGroup(textGroup);
        pt.body.collides([playerGroup, bulletGroup, textGroup, enemyGroup, enemyBulletGroup]);
    });

    player = game.add.sprite(400, 500, 'termfont', 383);
    player.anchor.setTo(0.5, 0.5);
    player.maxHealth = 10;
    player.health = player.maxHealth;
    game.physics.p2.enable(player);
    player.body.setCircle(8);
    player.body.fixedRotation = true;
    player.body.setCollisionGroup(playerGroup);
    player.body.collides([textGroup, enemyGroup]);

    healthHUD = game.add.group();
    healthHUD.createMultiple(player.maxHealth, 'colorCircle16', 3);
    healthHUD.forEach(function(heart){
        heart.anchor.setTo(0.5, 0.5);
    });
    updateHealthHUD();

    enemies = game.add.group();
    enemies.createMultiple(20, 'termfont', 1);
    game.physics.p2.enable(enemies);
    enemies.setAll('body.fixedRotation', true);
    enemies.forEach(function(enemy){
        enemy.body.setCollisionGroup(enemyGroup);
        enemy.body.collides([bulletGroup, textGroup]);
        enemy.body.collides(playerGroup, enemyHitPlayer);
        enemy.animations.add('strobe', [1,2], 5);
        enemy.animations.add('flash', [1,2], 15);
    });

    var en1 = enemies.getFirstExists(false);
    en1.reset(300, 300, 3);
    en1.animations.play('strobe', 5, true);


    bullets = game.add.group();
    bullets.createMultiple(20, 'termfont', 254);
    game.physics.p2.enable(bullets, true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.forEach(function(bullet){
        bullet.body.setCircle(4);
        bullet.body.setCollisionGroup(bulletGroup);
        bullet.body.collides(textGroup, bulletHitText);
        bullet.body.collides(enemyGroup, bulletHitEnemy);
    });

    enemyBullets = game.add.group();
    enemyBullets.createMultiple(20, 'termfont', 256);
    game.physics.p2.enable(enemyBullets, true);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
    enemyBullets.forEach(function(bullet){
        bullet.body.setCircle(4);
        bullet.body.setCollisionGroup(bulletGroup);
        bullet.body.collides(textGroup, bulletHitText);
        bullet.body.collides(enemyGroup, bulletHitEnemy);
    });

    controls = game.input.keyboard.createCursorKeys();
    fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    loadLevel(levelNumber);
    
}

function updateHealthHUD(){
    healthHUD.forEach(function(heart){
        if(heart.z <= player.health){
            heart.reset(10+heart.z*18, SCREEN_HEIGHT-10, 1);
        }else{
            heart.kill();
        }
    });
}

function loadLevel(levelNum){
    levelNumber = levelNum%levelCount;
    if(levelNumber < 0){
        levelNumber+=levelCount;
    }
    level = levelData.data[levelNumber];
    text.forEach(function(pt){
        var pos = pt.z-1;
        if(level[pos] > 0){
            pt.reset(p2x(pos)*WIDTH+WIDTH/2+OFFSETX, p2y(pos)*WIDTH+WIDTH/2+OFFSETY);
            pt.frame = level[pos];
        }else{
            pt.kill();
        }
    });
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

        if(player.body.x > SCREEN_WIDTH){
            player.body.x = 0;
            loadLevel(levelNumber+1);
        }
        if(player.body.x < 0){
            player.body.x = SCREEN_WIDTH;
            loadLevel(levelNumber-1);
        }
        if(player.body.y > SCREEN_HEIGHT){
            player.body.y = 0;
            loadLevel(levelNumber+levelCols);
        }
        if(player.body.y < 0){
            player.body.y = SCREEN_HEIGHT;
            loadLevel(levelNumber-levelCols);
        }


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
    sfxExplosion.play();
}

function enemyHitPlayer(enemy, player) {
    enemy.sprite.animations.play('flash', 15, true);
    enemy.sprite.damage(1);

    // var wallType = wall.frame;
    // console.log('hit', wallType);
    player.sprite.damage(1);
    updateHealthHUD();
    sfxExplosion.play();
}

function bulletHitEnemy(bullet, enemy) {
    bullet.sprite.kill();
    // var wallType = wall.frame;
    // console.log('hit', wallType);
    enemy.sprite.animations.play('flash', 15, true);
    enemy.sprite.damage(5);
    sfxEnemyDie.play();
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
            sfxFire.play();
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


