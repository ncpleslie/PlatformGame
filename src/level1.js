import Phaser from 'phaser'
import Player from './Player.js'

export default class Level1 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level1'
		})
		this.platforms = null
		this.player = null
		this.cursors = null
		this.layer = null
		this.coinLayer = null
		this.score = 0
		this.text = null
		this.badguy = null
		this.enemyMaxY = 530
		this.enemyMinY = 500 // The bottem layer = 568
		this.isPlayerAlive = null

		// DEBUGGING
		this.debugging = false
	}

	preload() {
		// Load images
		// Player Idle
		this.load.image('PlayerIdle1', '../assets/player/idle/idle_1.png')
		this.load.image('PlayerIdle2', '../assets/player/idle/idle_2.png')
		this.load.image('PlayerIdle3', '../assets/player/idle/idle_3.png')
		this.load.image('PlayerIdle4', '../assets/player/idle/idle_4.png')
		// Player Walk
		this.load.image('PlayerWalk1', '../assets/player/walk/run_1.png')
		this.load.image('PlayerWalk2', '../assets/player/walk/run_2.png')
		this.load.image('PlayerWalk3', '../assets/player/walk/run_3.png')
		this.load.image('PlayerWalk4', '../assets/player/walk/run_4.png')
		// Player Jump
		this.load.image('PlayerJump1', '../assets/player/jump/jump_1.png')
		this.load.image('PlayerJump2', '../assets/player/jump/jump_2.png')
		this.load.image('PlayerJump3', '../assets/player/jump/jump_3.png')

		this.load.image('Asset', 'https://i.imgur.com/jdqWEYB.png')
		this.load.image('Sky', 'https://i.imgur.com/fhFpcKN.png')
		this.load.image('Grass', 'https://i.imgur.com/rGPlCE8.png')
		this.load.image('tiles', 'https://i.imgur.com/JZKNeJO.png')
		this.load.spritesheet('badguy', 'https://i.imgur.com/HKgScVP.png', {
			frameWidth: 42,
			frameHeight: 32
		})
		// Load tile map locations
		this.load.tilemapTiledJSON(
			'map',
			'https://raw.githubusercontent.com/ncpleslie/SoftEngAssignment2/master/fork/scenes/level1.json'
		)
	}

	create() {
		// Create the world (Level 1)
		const map = this.make.tilemap({
			key: 'map',
			tileWidth: 16,
			tileHeight: 16
		})
		const tileset = map.addTilesetImage('marioTiles', 'tiles', 16, 16)
		const aboveLayer = map.createStaticLayer('Background', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('Platforms', tileset, 0, 0)
		this.coinLayer = map.createDynamicLayer('Coins', tileset, 0, 0)

		this.physics.world.bounds.width = aboveLayer.width
		this.physics.world.bounds.height = aboveLayer.height

		// Create the player
		this.player = new Player(this)

		// Set up player collidors
		worldLayer.setCollisionByProperty({ collision: true })
		this.physics.add.collider(this.player.sprite, worldLayer)

		// Camera
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.setRoundPixels(false)
		// This code is disabled. It allows for smooth camera slow-down
		//  this.cameras.main.startFollow(this.player, false, 0.05, 0.05)

		// Onscreen text. This is showing the score, for now
		this.text = this.add.text(100, 10, '0', {
			fontSize: '16px'
		})
		this.text.setScrollFactor(0)
		this.text.setText(`Level 1  Score: ${this.score}`)

		// Coins. These are collectable. It calls 'this.collectCoin' and clears the screen of that coin
		this.coinLayer.setTileIndexCallback(11, this.collectCoin, this)
		this.physics.add.overlap(this.player.sprite, this.coinLayer)

		// Kill if you fall in hole or touch anything black (Tile 39)
		worldLayer.setTileIndexCallback(39, this.gameOver, this)

		// Bad Guys. Repeat will add more. 1 in at the moment
		this.badguy = this.add.group({
			key: 'badguy',
			repeat: 0,
			setXY: {
				x: 1253,
				y: 568,
				stepX: 80,
				stepY: 20
			}
		})
		//Sets monster speed
		Phaser.Actions.Call(
			this.badguy.getChildren(),
			function(enemy) {
				enemy.speed = Math.random() * 2 + 1
			},
			this
		)
		// Scale the monster
		Phaser.Actions.ScaleXY(this.badguy.getChildren(), -0.5, -0.5)

		//Ending Variables

		// Player is alive
		this.isPlayerAlive = true
		// reset camera effects
		this.cameras.main.resetFX()

		/* DEBUGGING */
		if (this.debugging === true) {
			// Used for debugging. Will show colliding objects in new colour
			const debugGraphics = this.add.graphics().setAlpha(0.75)
			worldLayer.renderDebug(debugGraphics, {
				tileColor: null, // Color of non-colliding tiles
				collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
				faceColor: new Phaser.Display.Color(40, 39, 37, 255)
			})
		}
	}

	update(time, delta) {
		//Check if player is alive. If not, why bother even updating
		if (!this.isPlayerAlive) return

		this.player.update()

		// Bad guys
		let enemies = this.badguy.getChildren()
		let numEnemies = enemies.length
		for (let i = 0; i < numEnemies; i++) {
			// move enemies
			enemies[i].y += enemies[i].speed
			if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
				enemies[i].speed *= -1
			} else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
				enemies[i].speed *= -1
			}
			// If you hit the enemy, you die
			if (
				Phaser.Geom.Intersects.RectangleToRectangle(
					this.player.sprite.getBounds(),
					enemies[i].getBounds()
				)
			) {
				this.gameOver()
				break
			}
		}
	}

	// Coin collection function
	collectCoin(sprite, tile) {
		this.coinLayer.removeTileAt(tile.x, tile.y)
		this.score++
		this.text.setText(`Level 1  Score: ${this.score}`)

		// Load next level
		if (this.score === 8) {
			this.scene.start('Level2')
		}
		return false
	}

	// Game over. Has some camera functions I'm testing out and seeing what they do
	gameOver() {
		this.score = 0
		this.isPlayerAlive = false

		// shake the camera
		this.cameras.main.shake(500)

		this.player.destroy()

		// fade camera
		this.time.delayedCall(
			250,
			function() {
				this.cameras.main.fade(250)
			},
			[],
			this
		)

		// restart game
		this.time.delayedCall(
			500,
			function() {
				this.scene.restart()
			},
			[],
			this
		)
	}
}
