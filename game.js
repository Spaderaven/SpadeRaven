var cursors;
var config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 600,
      backgroundColor: 'black',
      parent: 'Juego',
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 0 },
              debug: false
          }
      },
      scene: {
          preload: preload,
          create: create,
          update: update,
          extend: {
            GenerateBarrels: GenerateBarrels,
            ColisionManBarrel: ColisionManBarrel,
            UpdateText: UpdateText,
            End: End
          }
      }
  };

var game = new Phaser.Game(config);

var man;
var barrel;
var right;
var left;
var speed = 800;
var barrels;
var text;
var backrund

const life = 5;
const minBarrels = 2;
const maxBarrels = 4;
const fallSpeed = 5;
const appearTime = 600;

function preload () {
    console.log("Preload");
    this.load.image('backroung', 'assets/Backround.png');
    this.load.image('man', 'assets/SteamMan.png');
    this.load.image('barrel', 'assets/FishBarrel4.png');

}


function create () {
    console.log("create");
    backrund = this.physics.add.sprite(game.config.width, game.config.height, 'backroung');
    man = this.physics.add.sprite(game.config.width / 2, game.config.height - 100, 'man');
    man.life = life;

    text = this.add.text(10,10, 'Vidas: ' + man.life, {
        fontSize: '40px',
        fill: '#ffffff'
    }).setDepth(0.1);

    barrels = this.physics.add.group( {
        defaultKey: 'barrel',
        frame: 0,
        maxSize: 50
    });

    this.time.addEvent({
        delay: appearTime,
        loop: true,
        callback: () => {
            this.GenerateBarrels()
        }
    })

    this.physics.add.overlap(man, barrels, this.ColisionManBarrel, null, this);

    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
}


function update () {
    console.log("update");

    Phaser.Actions.IncY(barrels.getChildren(), fallSpeed);
    barrels.children.iterate(function (barrel) {
        if(barrel.y > 600) {
            barrels.killAndHide(barrel);
        }
    })
    
    man.body.setVelocityX(0);

    if(left.isDown) {
        man.body.setVelocityX(-speed);
    }
    else if(right.isDown) {
        man.body.setVelocityX(speed);
    }

}


function GenerateBarrels() {

    var barrelNum = Phaser.Math.Between(minBarrels, maxBarrels);

    for(let i = 0; i < barrelNum; i++)
    {
        var theBarrel = barrels.get();

        if(theBarrel) {
            theBarrel.setActive(true).setVisible(true);
            theBarrel.y = -100;
            theBarrel.x = Phaser.Math.Between(0, game.config.width);

            this.physics.add.overlap(theBarrel, barrels, (barrelColition) => { 
                barrelColition.x = Phaser.Math.Between(0, game.config.width);
            })
        }
    }

}

function ColisionManBarrel(man, barrel) {

    if(barrel.active) {
        barrels.killAndHide(barrel);
        barrel.setActive(false);
        barrel.setVisible(false);
        if(man.life > 0) {
            man.life --;
            this.UpdateText();
        }
        else  {
            this.End();
        }
    }

}


function UpdateText() {
    text.setText( 'Vida: ' + man.life );
}


function End() {
    man.setActive(false);
    man.setVisible(false);
    texto = this.add.text(game.config.width / 2, game.config.height / 2 + 50, 'GAME OVER', {
        fontSize: '40px',
        fill: "#FFFFFF"
    }).setOrigin(0.5);
}