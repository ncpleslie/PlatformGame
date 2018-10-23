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
		// Level Building and add player, set world bounds
		this.loadLevelElements()
		this.setWorldBounds()
		// Player collision and bounds
		this.setPlayerAndWorldCollider()
		this.setDeathTiles(this.platform)
		// Camera
		this.setCameraOptions()
		this.makeBackgroundAParalax()
		// UI and other none-game features
		this.addHUD()
		this.pauseScene()
		// Add Coins and collection ability
		this.createCoins()
		this.makeCoinsCollectable()
		this.removeCollectedCoins()
		// Add Monsters and end of level point
		this.eventTriggers()
		this.addMonsters()

		//Ending Variables
		// ----------------------------------
		// Player is alive
		this.isPlayerAlive = true
		// reset camera effects
		this.cameras.main.resetFX()
		// Prevent functions from looping
		this.callPrevention = 0

		this.debug()
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

	// Set points of the map that will kill the player
	setDeathTiles(platform) {
		// Kill if you fall in hole or touch anything black (Tile 39)
		const killingBlocksArray = [116, 117, 142, 143, 168, 169, 194, 195, 220, 221, 246, 247]
		for (let i = 0; i < killingBlocksArray.length; i++) {
			platform.setTileIndexCallback(killingBlocksArray[i], this.gameOver, this)
		}
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

	loadLevelElements() {
		// Create the world (Level 2)
		this.map2 = this.make.tilemap({
			key: 'level2map',
			tileWidth: 16,
			tileHeight: 16
		})

		this.tileset = this.map2.addTilesetImage('CityTileSet', 'cityTiles', 16, 16)
		this.tilesetHills = this.map2.addTilesetImage('country-platform-back', 'Hills', 16, 16)
		this.fireSet = this.map2.addTilesetImage('boom3', 'boomImage', 16, 16)
		this.backLayer = this.map2.createStaticLayer('Background3', this.tilesetHills, 0, 0)
		this.smoke = this.map2.createStaticLayer('Smoke', this.fireSet, 0, 0)
		this.cityLayer2 = this.map2.createStaticLayer('Background2', this.tileset, 0, 0)
		this.fire = this.map2.createStaticLayer('Fire', this.fireSet, 0, 0)
		this.cityLayer1 = this.map2.createStaticLayer('Background1', this.tileset, 0, 0)
		// Create the player - Called here so they appear behind the lamps
		this.player = new Player(this)
		this.streetObject1 = this.map2.createStaticLayer('StreetObjects', this.tileset, 0, 0)
		this.streetObject2 = this.map2.createStaticLayer('StreetObjects2', this.tileset, 0, 0)
		this.platform = this.map2.createStaticLayer('Platform', this.tileset, 0, 0)
	}

	setWorldBounds() {
		this.physics.world.bounds.width = this.backLayer.width
		this.physics.world.bounds.height = this.backLayer.height
	}

	makeBackgroundAParalax() {
		this.backLayer.setScrollFactor(1)
		this.cityLayer1.setScrollFactor(0.99)
		this.fire.setScrollFactor(0.99)
		this.cityLayer2.setScrollFactor(0.95)
		this.smoke.setScrollFactor(0.95)
		this.streetObject1.setScrollFactor(1)
		this.streetObject2.setScrollFactor(1)
	}

	setCameraOptions() {
		// Camera
		this.cameras.main.setBounds(0, 0, this.map2.widthInPixels, this.map2.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.roundPixels = false
		// This code is disabled. It allows for smooth camera slow-down
		// this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
	}

	setPlayerAndWorldCollider() {
		// Set up player collidors
		this.platform.setCollisionByProperty({collision: true})
		this.physics.add.collider(this.player.sprite, this.platform)
	}

	addHUD() {
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
	}

	createCoins() {
		// Coins. These are collectable. It calls 'this.collectCoin' and clears the screen of that coin
		// ----------------------------------------------------------------------------------
		this.coinLayer = this.map2.createDynamicLayer('Coins', this.tileset, 0, 0)
	}

	makeCoinsCollectable() {
		const coinID = 34
		this.coinLayer.setTileIndexCallback(coinID, this.collectCoin, this)
	}

	removeCollectedCoins() {
		this.physics.add.overlap(this.player.sprite, this.coinLayer)
	}

	eventTriggers() {
		// Set up events (Monsters, ending door, storyline, etc)
		// Event Triggers
		this.eventObjectArray = []
		for (let i = 0; i < this.map2.objects[0].objects.length; i++) {
			this.eventObjectArray.push(this.map2.objects[0].objects[i])
		}
	}

	addMonsters() {
		// Create monster
		// ----------------------------------------------------------------------------------
		this.monsters = []
		for (let i = 0; i < this.eventObjectArray.length - 1; i++) {
			this.monsters.push(new Monster(this, this.eventObjectArray[i].x, this.eventObjectArray[i].x - 100))
			this.monsters[i].create()
		}
	}

	debug() {
		/* DEBUGGING */
		if (this.debugging === true) {
			// Used for debugging. Will show colliding objects in new colour
			const debugGraphics = this.add.graphics().setAlpha(0.75)
			this.platform.renderDebug(debugGraphics, {
				tileColor: null, // Color of non-colliding tiles
				collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
				faceColor: new Phaser.Display.Color(40, 39, 37, 255)
			})
		}
	}
}
