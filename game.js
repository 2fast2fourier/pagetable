
var game;

function loadInit(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
}

var introData = [
1,2,3,4,5,6,7,8,9,12,0,0,0,0,0,0,0,0,0,0,0,0,0,11,12,13,14,15,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10
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
var OFFSETX = 6, OFFSETY = 6;

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
        var pos = pt.z;
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

    // //  Our bullet group
    // bullets = game.add.group();
    // bullets.enableBody = true;
    // bullets.physicsBodyType = Phaser.Physics.ARCADE;
    // bullets.createMultiple(30, 'bullet');
    // bullets.setAll('anchor.x', 0.5);
    // bullets.setAll('anchor.y', 1);
    // bullets.setAll('outOfBoundsKill', true);
    // bullets.setAll('checkWorldBounds', true);

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

    // //  The hero!

    // //  The baddies!
    // aliens = game.add.group();
    // aliens.enableBody = true;
    // aliens.physicsBodyType = Phaser.Physics.ARCADE;

    // createAliens();

    // //  The score
    // scoreString = 'Score : ';
    // scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    // //  Lives
    // lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    // //  Text
    // stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    // stateText.anchor.setTo(0.5, 0.5);
    // stateText.visible = false;

    // for (var i = 0; i < 3; i++) 
    // {
    //     var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
    //     ship.anchor.setTo(0.5, 0.5);
    //     ship.angle = 90;
    //     ship.alpha = 0.4;
    // }

    // //  An explosion pool
    // explosions = game.add.group();
    // explosions.createMultiple(30, 'kaboom');
    // explosions.forEach(setupInvader, this);

    // //  And some controls to play the game with
    arrows = game.input.keyboard.createCursorKeys();
    // fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

// function createAliens () {

//     for (var y = 0; y < 4; y++)
//     {
//         for (var x = 0; x < 10; x++)
//         {
//             var alien = aliens.create(x * 48, y * 50, 'invader');
//             alien.anchor.setTo(0.5, 0.5);
//             alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
//             alien.play('fly');
//             alien.body.moves = false;
//         }
//     }

//     aliens.x = 100;
//     aliens.y = 50;

//     //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
//     var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

//     //  When the tween loops it calls descend
//     tween.onLoop.add(descend, this);
// }

// function setupInvader (invader) {

//     invader.anchor.x = 0.5;
//     invader.anchor.y = 0.5;
//     invader.animations.add('kaboom');

// }

// function descend() {

//     aliens.y += 10;

// }

function update() {

    if (player.alive)
    {
        player.body.velocity.setTo(0, 0);

        if (arrows.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        if (arrows.right.isDown)
        {
            player.body.velocity.x = 200;
        }
        if (arrows.up.isDown)
        {
            player.body.velocity.y = -200;
        }
        if (arrows.down.isDown)
        {
            player.body.velocity.y = 200;
        }

        //  Firing?
        // if (fireButton.isDown)
        // {
        //     fireBullet();
        // }

        // if (game.time.now > firingTimer)
        // {
        //     enemyFires();
        // }

        //  Run collision
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

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (wall, player) {
    console.log('coll', arguments);
    // player.body.velocity.setTo(-player.body.velocity.x, -player.body.velocity.y);

    //  When a bullet hits an alien we kill them both
    // bullet.kill();
    // alien.kill();

    // //  Increase the score
    // score += 20;
    // scoreText.text = scoreString + score;

    // //  And create an explosion :)
    // var explosion = explosions.getFirstExists(false);
    // explosion.reset(alien.body.x, alien.body.y);
    // explosion.play('kaboom', 30, false, true);

    // if (aliens.countLiving() == 0)
    // {
    //     score += 1000;
    //     scoreText.text = scoreString + score;

    //     enemyBullets.callAll('kill',this);
    //     stateText.text = " You Won, \n Click to restart";
    //     stateText.visible = true;

    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    // }

}

function enemyHitsPlayer (player,bullet) {
    
    // bullet.kill();

    // live = lives.getFirstAlive();

    // if (live)
    // {
    //     live.kill();
    // }

    // //  And create an explosion :)
    // var explosion = explosions.getFirstExists(false);
    // explosion.reset(player.body.x, player.body.y);
    // explosion.play('kaboom', 30, false, true);

    // // When the player dies
    // if (lives.countLiving() < 1)
    // {
    //     player.kill();
    //     enemyBullets.callAll('kill');

    //     stateText.text=" GAME OVER \n Click to restart";
    //     stateText.visible = true;

    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    // }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    // enemyBullet = enemyBullets.getFirstExists(false);

    // livingEnemies.length=0;

    // aliens.forEachAlive(function(alien){

    //     // put every living enemy in an array
    //     livingEnemies.push(alien);
    // });


    // if (enemyBullet && livingEnemies.length > 0)
    // {
        
    //     var random=game.rnd.integerInRange(0,livingEnemies.length-1);

    //     // randomly select one of them
    //     var shooter=livingEnemies[random];
    //     // And fire the bullet from this enemy
    //     enemyBullet.reset(shooter.body.x, shooter.body.y);

    //     game.physics.arcade.moveToObject(enemyBullet,player,120);
    //     firingTimer = game.time.now + 2000;
    // }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    // if (game.time.now > bulletTime)
    // {
    //     //  Grab the first bullet we can from the pool
    //     bullet = bullets.getFirstExists(false);

    //     if (bullet)
    //     {
    //         //  And fire it
    //         bullet.reset(player.x, player.y + 8);
    //         bullet.body.velocity.y = -400;
    //         bulletTime = game.time.now + 200;
    //     }
    // }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    // lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    // aliens.removeAll();
    // createAliens();

    //revives the player
    // player.revive();
    //hides the text
    // stateText.visible = false;

}


