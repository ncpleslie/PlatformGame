import Phaser from 'phaser'
import Player from './Player.js'
import Preloader from './Preloader.js'

export default class Level1 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level1'
		})
		this.score = 0
		this.text = ''
		this.isPlayerAlive = null
		this.counter = 0

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
		const cityLayer2 = map.createStaticLayer('Background2', tileset, 0, 0)
		const cityLayer1 = map.createStaticLayer('Background1', tileset, 0, 0)
		// Create the player - Called here so they appear behind the lamps
		this.player = new Player(this)
		const streetObject1 = map.createStaticLayer('StreetObjects', tileset, 0, 0)
		const streetObject2 = map.createStaticLayer('StreetObjects2', tileset, 0, 0)
		const platform = map.createStaticLayer('Platform', tileset, 0, 0)

		this.physics.world.bounds.width = backLayer.width
		this.physics.world.bounds.height = backLayer.height

		// Pause Game
		this.pauseScene()

		// Set up player collidors
		platform.setCollisionByProperty({collision: true})
		this.physics.add.collider(this.player.sprite, platform)

		// Camera
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.roundPixels = false
		backLayer.setScrollFactor(1)
		cityLayer1.setScrollFactor(0.99)
		cityLayer2.setScrollFactor(0.95)
		streetObject1.setScrollFactor(1)
		streetObject2.setScrollFactor(1)
		// This code is disabled. It allows for smooth camera slow-down
		// this.cameras.main.startFollow(this.player, false, 0.05, 0.05)

		// Onscreen text. This is showing the score, for now
		this.scoreText = this.add.text(100, 10, '0', {
			fontSize: '18px',
			fill: '#000000',
			padding: {x: 10, y: 10},
			backgroundColor: '#FFFFFF'
		})
		this.scoreText.alpha = 0.7
		this.scoreText.setScrollFactor(0)
		this.scoreText.setText(`Level 1  Score: ${this.score}`)

		// Event Triggers - Storyline
		this.event1 = map.findObject('EventTrigger', obj => obj.name === 'Event1')
		this.event2 = map.findObject('EventTrigger', obj => obj.name === 'Event2')
		this.event3 = map.findObject('EventTrigger', obj => obj.name === 'Event3')
		this.event4 = map.findObject('EventTrigger', obj => obj.name === 'Event4')

		// Kill if you fall in hole or touch anything black (Tile 39)
		platform.setTileIndexCallback(39, this.gameOver, this)

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
		// Disabled Monsters
		// this.monster.update()

		// Storyline triggers
		this.storyLine()
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
	// Story elements.
	storyLine() {
		const storylineText = {
			story1: `This is you.
			You're first name is "The". You're last name is "Wizard"... 
			Seriously. 
			Look it up. 
			You're called "The Wizard"`,
			story2: `You're Christchurch's only Wizard
			A true protector of the citizens`,
			story3: `You've lived here your entire life
			You call Christchurch your home
			You'd do anything for it`,
			story4: `But one day
			Everything changed...`
		}

		// Display storyline text. If the player reaches the same X as the objects
		// that come from the JSON file, it will trigger the story elements to show
		if (this.player.sprite.x >= this.event1.x && this.counter === 0) {
			// Create story text element
			this.storyText = this.add
				.text(400, 300, '', {
					font: '18px monospace',
					fill: '#000000',
					padding: {x: 10, y: 10},
					backgroundColor: '#FFFFFF'
				})
				.setScrollFactor(0)
				.setOrigin(0.5, 0.5)
			// Change opacity
			this.storyText.alpha = 0.7
			// Counter to prevent it from calling this more than once
			this.counter++
			this.storyText.setText(storylineText.story1)
		} else if (this.player.sprite.x >= this.event2.x && this.counter === 2) {
			this.counter++
			this.storyText.setText(storylineText.story2)
		} else if (this.player.sprite.x >= this.event3.x && this.counter === 4) {
			this.counter++
			this.storyText.setText(storylineText.story3)
		} else if (this.player.sprite.x >= this.event4.x && this.counter === 6) {
			this.counter++
			this.storyText.setText(storylineText.story4)
			this.earthQuake()

			// Remove the text from screen
		} else if (this.player.sprite.x >= this.event2.x - 50 && this.counter === 1) {
			this.counter++
			this.storyText.setText(``)
		} else if (this.player.sprite.x >= this.event3.x - 50 && this.counter === 3) {
			this.counter++
			this.storyText.setText(``)
		} else if (this.player.sprite.x >= this.event4.x - 50 && this.counter === 5) {
			this.counter++
			this.storyText.setText(``)
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
			.text(400, 300, '', {
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
			function(e) {
				if (e.key === 'p') {
					this.scene.pause()
					this.scene.launch('Pause')
					this.pauseText.setText('PAUSED')
				} else {
					this.pauseText.setText('')
				}
			},
			this
		)
	}
}
