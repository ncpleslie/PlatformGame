import Phaser from 'phaser'
import Player from '../Player.js'
import Preloader from '../Preloader.js'
import Monster from '../Monster.js'

export default class Level2 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level2'
		})
		this.score = 0
		this.isPlayerAlive = null
		this.lives = 3
		this.callPrevention = 0

		this.halfWidth = window.innerWidth / 2
		this.halfHeight = window.innerHeight / 2

		// DEBUGGING
		this.debugging = false
	}

	preload() {
		let preloader = new Preloader(this)
		preloader.preload()

		// Load tile map locations
		this.load.tilemapTiledJSON('level2map', 'https://raw.githubusercontent.com/ncpleslie/PlatformGame/master/src/chch2.json')
	}

	create() {
		// Create the world (Level 1)
		const map2 = this.make.tilemap({
			key: 'level2map',
			tileWidth: 16,
			tileHeight: 16
		})

		const tileset = map2.addTilesetImage('CityTileSet', 'cityTiles', 16, 16)
		const tilesetHills = map2.addTilesetImage('country-platform-back', 'Hills', 16, 16)
		const fireSet = map2.addTilesetImage('boom3', 'boomImage', 16, 16)
		const backLayer = map2.createStaticLayer('Background3', tilesetHills, 0, 0)
		const smoke = map2.createStaticLayer('Smoke', fireSet, 0, 0)
		const cityLayer2 = map2.createStaticLayer('Background2', tileset, 0, 0)
		const fire = map2.createStaticLayer('Fire', fireSet, 0, 0)
		const cityLayer1 = map2.createStaticLayer('Background1', tileset, 0, 0)
		// Create the player - Called here so they appear behind the lamps
		this.player = new Player(this)
		const streetObject1 = map2.createStaticLayer('StreetObjects', tileset, 0, 0)
		const streetObject2 = map2.createStaticLayer('StreetObjects2', tileset, 0, 0)
		const platform = map2.createStaticLayer('Platform', tileset, 0, 0)

		this.physics.world.bounds.width = backLayer.width
		this.physics.world.bounds.height = backLayer.height

		// Pause Game
		this.pauseScene()

		// Set up player collidors
		platform.setCollisionByProperty({collision: true})
		this.physics.add.collider(this.player.sprite, platform)

		// Camera
		this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.roundPixels = false
		backLayer.setScrollFactor(1)
		cityLayer1.setScrollFactor(0.99)
		fire.setScrollFactor(0.99)
		cityLayer2.setScrollFactor(0.95)
		smoke.setScrollFactor(0.95)
		streetObject1.setScrollFactor(1)
		streetObject2.setScrollFactor(1)
		// This code is disabled. It allows for smooth camera slow-down
		// this.cameras.main.startFollow(this.player, false, 0.05, 0.05)

		// Onscreen text. This is showing the score, for now
		this.scoreText = this.add
			.text(this.halfWidth, this.halfHeight / 15, '0', {
				fontSize: '18px',
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setOrigin(0.5, 0.5)
			.setScrollFactor(0)
			.setText(`Level 2  Score: ${this.score} Lives: ${this.lives}`)
		this.scoreText.alpha = 0.7

		// Set points of the map that will kill the player
		this.killingBlocks(platform)

		// Coins. These are collectable. It calls 'this.collectCoin' and clears the screen of that coin
		// ----------------------------------------------------------------------------------
		this.coinLayer = map2.createDynamicLayer('Coins', tileset, 0, 0)
		const coinID = 34
		this.coinLayer.setTileIndexCallback(coinID, this.collectCoin, this)
		this.physics.add.overlap(this.player.sprite, this.coinLayer)

		// Set up events (Monsters, ending door, storyline, etc)
		// Event Triggers
		this.eventObjectArray = []
		for (let i = 0; i < map2.objects[0].objects.length; i++) {
			this.eventObjectArray.push(map2.objects[0].objects[i])
		}

		// Create monster
		// ----------------------------------------------------------------------------------
		this.monsters = []
		for (let i = 0; i < this.eventObjectArray.length - 1; i++) {
			this.monsters.push(new Monster(this, this.eventObjectArray[i].x, this.eventObjectArray[i].x - 100))
			this.monsters[i].create()
		}

		//Ending Variables
		// Player is alive
		this.isPlayerAlive = true
		// reset camera effects
		this.cameras.main.resetFX()
		// Prevent functions from looping
		this.callPrevention = 0

		/* DEBUGGING */
		if (this.debugging === true) {
			// Used for debugging. Will show colliding objects in new colour
			const debugGraphics = this.add.graphics().setAlpha(0.75)
			platform.renderDebug(debugGraphics, {
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

		// Monsters
		for (let aMonster of this.monsters) {
			aMonster.update()
		}

		this.loadNextLevel()
	}

	loadNextLevel() {
		if (this.player.sprite.x >= this.eventObjectArray[this.eventObjectArray.length - 1].x - 20) {
			this.scene.start('Gameover')
		}
	}
	// Coin collection function
	// This function removes the coin, adds a point to the score.
	// If enough points then the player gets a new life
	collectCoin(sprite, tile) {
		this.coinLayer.removeTileAt(tile.x, tile.y)
		this.score++
		this.scoreText.setText(`Level 2  Score: ${this.score} Lives: ${this.lives}`)

		// Give +1 life if they collect 10 coins
		const newLife = this.score % 10
		if (newLife === 0) {
			this.lives++
		}
		return false
	}

	// Game over. Has some camera functions I'm testing out and seeing what they do
	gameOver() {
		this.score = 0
		this.isPlayerAlive = false

		if (this.lives > 0 && this.callPrevention === 0) {
			this.lives--
			this.callPrevention++
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
		if (this.lives === 0) {
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
					this.scene.start('Gameover')
				},
				[],
				this
			)
		}
	}
	killingBlocks(platform) {
		// Kill if you fall in hole or touch anything black (Tile 39)
		const killingBlocksArray = [116, 117, 142, 143, 168, 169, 194, 195, 220, 221, 246, 247]
		for (let i = 0; i < killingBlocksArray.length; i++) {
			platform.setTileIndexCallback(killingBlocksArray[i], this.gameOver, this)
		}
	}

	// An effect to simulate an earthquake, fade=out and call the next level
	earthQuake() {
		this.time.delayedCall(
			2500,
			function() {
				this.cameras.main.shake(5000)
				this.time.delayedCall(
					2500,
					function() {
						this.cameras.main.fade(2500)
					},
					[],
					this
				)
				this.time.delayedCall(
					5000,
					function() {
						this.scene.restart()
					},
					[],
					this
				)
			},
			[],
			this
		)
	}

	pauseScene() {
		this.pauseText = this.add
			.text(this.halfWidth, this.halfHeight, '', {
				font: '18px monospace',
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setScrollFactor(0)
			.setOrigin(0.5, 0.5)

		this.pauseText.alpha = 0.7
		// Brings it on top of every other text box
		this.pauseText.depth = 100

		this.input.keyboard.on(
			'keyup',
			e => {
				if (e.key === 'p') {
					this.scene.pause()
					this.scene.launch('Pause2')
					this.pauseText.setText('PAUSED')
				} else {
					this.pauseText.setText('')
				}
			},
			this
		)
	}
}
