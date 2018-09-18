import Phaser from 'phaser'
import Player from './Player.js'
import Preloader from './Preloader.js'
import Monster from './Monster.js'

export default class Level1 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level1'
		})
		this.score = 0
		this.text = ''
		this.isPlayerAlive = null

		// DEBUGGING
		this.debugging = false
	}

	preload() {
		let preloader = new Preloader(this)
		preloader.preload()
		// Load images

		// Player Specific Preload
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

		// Level Specific Preload
		this.load.image('Hills', '../assets/country-platform-back.png')
		this.load.image('cityTiles', '../assets/CityTileSet.png')
		this.load.spritesheet('badguy', 'https://i.imgur.com/HKgScVP.png', {
			frameWidth: 42,
			frameHeight: 32
		})
		// Load tile map locations
		this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/ncpleslie/PlatformGame/master/src/chch.json')
	}

	create() {
		// Create the world (Level 1)
		const map = this.make.tilemap({
			key: 'map',
			tileWidth: 16,
			tileHeight: 16
		})
		const tileset = map.addTilesetImage('CityTileSet', 'cityTiles', 16, 16)
		const tilesetHills = map.addTilesetImage('country-platform-back', 'Hills', 16, 16)
		const backLayer = map.createStaticLayer('Background3', tilesetHills, 0, 0)
		const aboveLayer = map.createStaticLayer('Background2', tileset, 0, 0)
		const aboveLayer2 = map.createStaticLayer('Background1', tileset, 0, 0)
		const aboveLayer3 = map.createStaticLayer('StreetObjects', tileset, 0, 0)
		const aboveLayer4 = map.createStaticLayer('StreetObjects2', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('Platform', tileset, 0, 0)

		this.physics.world.bounds.width = aboveLayer.width
		this.physics.world.bounds.height = aboveLayer.height

		console.log(worldLayer)
		// Create the player
		this.player = new Player(this)

		// Set up player collidors
		worldLayer.setCollisionByProperty({collision: true})
		this.physics.add.collider(this.player.sprite, worldLayer)

		// Camera
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.setRoundPixels(false)
		backLayer.setScrollFactor(1)
		aboveLayer2.setScrollFactor(0.99)
		aboveLayer3.setScrollFactor(0.95)

		// This code is disabled. It allows for smooth camera slow-down
		// this.cameras.main.startFollow(this.player, false, 0.05, 0.05)

		// Onscreen text. This is showing the score, for now
		this.text = this.add.text(100, 10, '0', {
			fontSize: '16px'
		})
		this.text.setScrollFactor(0)
		this.text.setText(`Level 1  Score: ${this.score}`)

		// Kill if you fall in hole or touch anything black (Tile 39)
		worldLayer.setTileIndexCallback(39, this.gameOver, this)

		// DISABLED DUE TO NO COINS! Coins. These are collectable. It calls 'this.collectCoin' and clears the screen of that coin
		// ----------------------------------------------------------------------------------
		// this.coinLayer = map.createDynamicLayer('Coins', tileset, 0, 0)
		// this.coinLayer.setTileIndexCallback(11, this.collectCoin, this)
		// this.physics.add.overlap(this.player.sprite, this.coinLayer)

		// DISABLED DUE TO NO MONSTERS! Create monster
		// ----------------------------------------------------------------------------------
		// this.monster = new Monster(this, 530, 500)
		// this.monster.create()

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
		// Disabled Monsters
		// this.monster.update()
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
