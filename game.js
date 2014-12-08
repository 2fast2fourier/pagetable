
var game;

function loadInit(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
}

var destroyableWalls = [461,442];



function preload() {

    game.load.image('white32', 'white32.png');
    game.load.image('black32', 'black32.png');
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
var OFFSETX = 24, OFFSETY = 16;

var AI_CONSTANTS = {
    brawler: {
        sightRadius: 200,
        moveSpeedAttack: 250,
        moveSpeedNormal: 150,
        damage: 2,
        health: 3,
        anim: {
            hit: 'hit',
            attack: 'attack',
            idle: 'idle'
        }
    },
    shooter: {
        sightRadius: 250,
        moveSpeedAttack: 150,
        moveSpeedNormal: 100,
        bulletSpeed: 300,
        bulletDelay: 500,
        bulletReclaim: 500,
        bulletDamage: 1,
        damage: 1,
        health: 5,
        anim: {}
    },
    sniper: {
        sightRadius: 300,
        moveSpeedAttack: 0,
        moveSpeedNormal: 0,
        bulletSpeed: 300,
        bulletDelay: 500,
        bulletReclaim: 1000,
        bulletDamage: 2,
        damage: 1,
        health: 5,
        anim: {}
    }
};
var PLAYER_CONSTANTS = {
    bulletDamage: 3,
    moveSpeed: 300,
    bulletSpeed: 500,
    bulletDelay: 200,
    damage: 2
};
var aiTypes = {
    1: AI_CONSTANTS.brawler,
    2: AI_CONSTANTS.brawler,
    15: AI_CONSTANTS.sniper,
    277: AI_CONSTANTS.shooter
};

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
    var playerSpawn = 200;
    levelData = game.cache.getJSON('leveldata');
    levelCount = levelData.data.length;

    for(var ix=0;ix<levelCount;ix++){
        var lvl = levelData.data[ix];
        for(var iy=0;iy<lvl.length;iy++){
            if(lvl[iy] === 383){
                levelNumber = ix;
                playerSpawn = iy;
            }
        }
    }

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

    background = game.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'black32');

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



    player = game.add.sprite(p2x(playerSpawn)*WIDTH+OFFSETX, p2y(playerSpawn)*WIDTH+OFFSETY, 'termfont', 383);
    player.anchor.setTo(0.5, 0.5);
    player.maxHealth = 10;
    player.health = player.maxHealth;
    game.physics.p2.enable(player);
    player.body.setCircle(8);
    player.body.fixedRotation = true;
    player.body.setCollisionGroup(playerGroup);
    player.body.collides([textGroup, enemyGroup, enemyBulletGroup]);
    player.ai = {
        constants: PLAYER_CONSTANTS
    };

    healthHUD = game.add.group();
    healthHUD.createMultiple(player.maxHealth, 'termfont', 278);
    game.physics.p2.enable(healthHUD);
    healthHUD.setAll('body.static', true);
    healthHUD.setAll('body.fixedRotation', true);
    healthHUD.forEach(function(heart){
        heart.anchor.setTo(0.5, 0.5);
        heart.body.setCollisionGroup(textGroup);
        heart.body.collides([bulletGroup, enemyBulletGroup]);
        heart.events.onKilled.add(function(){
            player.damage(1);
            updateHealthHUD();
        });
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
        enemy.animations.add('idle', [1,2], 2, true);
        enemy.animations.add('attack', [1,2], 8, true);
        enemy.animations.add('hit', [1,2], 16, true);
    });


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
        bullet.body.setCollisionGroup(enemyBulletGroup);
        bullet.body.collides(textGroup, bulletHitText);
        bullet.body.collides(playerGroup, bulletHitPlayer);
    });

    controls = game.input.keyboard.createCursorKeys();
    fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    loadLevel(levelNumber);
    
}

function updateHealthHUD(){
    healthHUD.forEach(function(heart){
        if(heart.z <= player.health){
            heart.reset(20+heart.z*17, SCREEN_HEIGHT-18, 1);
        }else{
            heart.exists = false;
        }
    });
}

function loadLevel(levelNum){
    levelNumber = levelNum%levelCount;
    if(levelNumber < 0){
        levelNumber+=levelCount;
    }
    level = levelData.data[levelNumber];
    enemies.callAllExists('kill', true);
    text.callAllExists('kill', true);
    bullets.callAllExists('kill', true);
    enemyBullets.callAllExists('kill', true);
    text.forEach(function(pt){
        var pos = pt.z-1;
        var type = level[pos];
        var enemy;
        var aiType = aiTypes[type];
        if(type === 383){
            //skip, used elsewhere
        }else if(aiType){
            enemy = enemies.getFirstExists(false);
            if(enemy){
                enemy.ai = {
                    constants: aiType,
                    bulletDelay: 0
                };
                enemy.reset(p2x(pos)*WIDTH+OFFSETX, p2y(pos)*WIDTH+OFFSETY, enemy.ai.constants.health);
                enemy.frame = type;
                playAnimation(enemy, enemy.ai.constants.anim.idle);
            }
        }else if(type > 0){
            pt.reset(p2x(pos)*WIDTH+OFFSETX, p2y(pos)*WIDTH+OFFSETY);
            pt.frame = level[pos];
        }
    });
}

function update() {

    if (!paused && player.alive){
        player.body.setZeroVelocity();

        if (controls.left.isDown){
            player.body.moveLeft(PLAYER_CONSTANTS.moveSpeed);
            player.rotation = 1.5*Math.PI;
        }
        if (controls.right.isDown){
            player.body.moveRight(PLAYER_CONSTANTS.moveSpeed);
            player.rotation = Math.PI/2;
        }
        if (controls.up.isDown){
            player.body.moveUp(PLAYER_CONSTANTS.moveSpeed);
            player.rotation = 0;
        }
        if (controls.down.isDown){
            player.body.moveDown(PLAYER_CONSTANTS.moveSpeed);
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

        enemyBullets.forEachAlive(function(bullet){
            if(bullet.reclaim < game.time.now){
                bullet.kill();
            }
        });

        enemies.forEachAlive(function(enemy){
            if(enemy.ai.stunned > game.time.now){
                playAnimation(enemy, enemy.ai.constants.anim.hit);
                enemy.body.damping = 0.8;
                //sit and wait
            }else if(Phaser.Point.distance(enemy, player) < enemy.ai.constants.sightRadius){
                playAnimation(enemy, enemy.ai.constants.anim.attack);
                var rot = Phaser.Point.angle(player, enemy);
                enemy.body.damping = 0;
                enemy.body.velocity.x = Math.cos(rot)*enemy.ai.constants.moveSpeedAttack;
                enemy.body.velocity.y = Math.sin(rot)*enemy.ai.constants.moveSpeedAttack;
                if(enemy.ai.constants.bulletSpeed > 0 && game.time.now > enemy.ai.bulletDelay){
                    enemyFire(enemy, rot);
                }
            }else{
                playAnimation(enemy, enemy.ai.constants.anim.idle);
                enemy.body.damping = 0.9;
            }
        });
    }

}

function playAnimation(sprite, anim){
    if(anim && sprite.ai.currentAnim !== anim){
        sprite.animations.play(anim);
        sprite.ai.currentAnim = anim;
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
    var playerDamage = player.sprite.ai.constants.damage;
    if(playerDamage > 0){
        playAnimation(enemy.sprite, enemy.sprite.ai.constants.anim.hit);
        enemy.sprite.damage(playerDamage);
        enemy.sprite.ai.stunned = game.time.now+2000;
    }
    var enemyDamage = enemy.sprite.ai.constants.damage;
    if(enemyDamage > 0){
        // playAnimation(player.sprite, player.sprite.ai.constants.anim.hit);
        player.sprite.damage(enemyDamage);
        sfxExplosion.play();
    }
    updateHealthHUD();
}

function bulletHitEnemy(bullet, enemy) {
    var damage = bullet.sprite.firedBy.ai.constants.bulletDamage;
    bullet.sprite.kill();
    if(damage > 0){
        playAnimation(enemy.sprite, enemy.sprite.ai.constants.anim.hit);
        enemy.sprite.damage(damage);
        sfxEnemyDie.play();
    }
}

function bulletHitPlayer(bullet, player) {
    bullet.sprite.kill();
    // player.sprite.animations.play('damaged');
    var damage = bullet.sprite.firedBy.ai.constants.bulletDamage;
    if(damage > 0){
        player.sprite.damage(damage);
        sfxEnemyDie.play();
    }
    updateHealthHUD();
}

function playerFire(){
    if (game.time.now > bulletDelay){
        var bullet = bullets.getFirstExists(false);
        if (bullet){
            bullet.reset(player.x, player.y);
            bullet.body.fixedRotation = false;
            bullet.firedBy = player;
            bullet.body.rotation = player.rotation;
            bullet.body.moveForward(PLAYER_CONSTANTS.bulletSpeed);
            bullet.body.fixedRotation = true;
            bullet.reclaim = game.time.now + 500;
            bulletDelay = game.time.now + PLAYER_CONSTANTS.bulletDelay;
            sfxFire.play();
        }
    }
}

function enemyFire(enemy, angle){
    var bullet = enemyBullets.getFirstExists(false);
    if (bullet){
        bullet.reset(enemy.body.x, enemy.body.y);
        bullet.body.setZeroVelocity();
        bullet.body.setZeroRotation();
        bullet.firedBy = enemy;
        bullet.body.velocity.x = Math.cos(angle)*enemy.ai.constants.bulletSpeed;
        bullet.body.velocity.y = Math.sin(angle)*enemy.ai.constants.bulletSpeed;
        bullet.reclaim = game.time.now + enemy.ai.constants.bulletReclaim;
        enemy.ai.bulletDelay = game.time.now + enemy.ai.constants.bulletDelay;
        sfxFire.play();
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


