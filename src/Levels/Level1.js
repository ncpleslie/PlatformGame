import Phaser from 'phaser'
import Player from '../Player.js'
import Preloader from '../Preloader.js'

export default class Level1 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level1'
		})
		this.score = 0
		this.isPlayerAlive = null
		this.counter = 0
		this.eventArray = null
		this.storyText = null

		this.halfWidth = window.innerWidth / 2
		this.halfHeight = window.innerHeight / 2

		// DEBUGGING
		this.debugging = false
	}

	preload() {
		this.width = this.cameras.main.width
		this.height = this.cameras.main.height
	}

	create() {
		// Audio
		this.loadAudio()
		// Level Building and add player, and set world bounds
		this.loadLevelElements()
		this.setWorldBounds()
		// Player collision and death
		this.setPlayerAndWorldCollider()
		this.setDeathTiles()
		// Camera
		this.setCameraOptions()
		this.makeBackgroundAParalax()
		// UI and other none-game features
		this.addHUD()
		this.pauseScene()
		// Story
		this.eventTriggers()

		//Ending Variables
		// ----------------------------------
		// Player is alive
		this.isPlayerAlive = true
		// reset camera effects
		this.cameras.main.resetFX()
		// Load the bounds of the game
		this.debug()
	}

	update(time, delta) {
		//Check if player is alive. If not, why bother even updating
		if (!this.isPlayerAlive) return
		this.player.update()
		// Storyline triggers
		this.storyLine()
	}

	// Everything below this line will affect the game.
	// ------------------------------------------------------------------------------------
	loadAudio() {
		this.audioScene = this.scene.get('Audio')
		this.level1Song = this.audioScene.loadSound('levelSong')
		this.audioScene.playSound(this.level1Song, true)
	}

	// Game over. Has some camera functions I'm testing out and seeing what they do
	gameOver() {
		this.audioScene.playSound(this.level1Song, false)
		this.score = 0
		this.isPlayerAlive = false
		this.counter = 0

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
				this.destroy()
				this.scene.start('Level2')
			},
			[],
			this
		)
	}

	// Story elements. Constantly called in update(). Story text is in an array.
	// As the player progress to a certain point it triggers the text to be displayed
	// If they continue, the text is removed
	storyLine() {
		const storylineTextArray = [
			`This is you.
				Your first name is "The". Your last name is "Wizard"... 
				Seriously. 
				Look it up. 
				You're called "The Wizard"`,
			`You're Christchurch's only Wizard
				A true protector of the citizens`,
			`You've lived here your entire life
				You call Christchurch your home
				You'd do anything for it`,
			`But one day
				Everything changed...`
		]

		const MAX_NUM_COUNTER = 4

		if (this.counter !== MAX_NUM_COUNTER) {
			if (this.player.sprite.x >= this.eventArray[this.counter].x) {
				this.storyText = this.add
					.text(this.width / 2, this.height / 2, '', {
						fill: '#000000',
						padding: {
							x: 10,
							y: 10
						},
						backgroundColor: '#FFFFFF'
					})
					.setScrollFactor(0)
					.setOrigin(0.5, 0.5)
					.setFontSize(`${this.width / 50}px`)
				this.storyText.alpha = 0.7

				this.storyText.setText(storylineTextArray[this.counter])
				this.counter++
				if (this.counter === MAX_NUM_COUNTER) {
					this.earthQuake()
				}
			} else if (this.player.sprite.x >= this.eventArray[this.counter].x - 50) {
				if (this.storyText) {
					this.storyText.setText('')
				}
			}
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
						this.scene.start('Level2')
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
			.text(this.width / 2, this.height / 2, '', {
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
					this.scene.pause('Level1')
					this.scene.launch('Pause')
					this.pauseText.setText('PAUSED')
				} else {
					this.scene.resume()
					this.pauseText.setText('')
				}
			},
			this
		)
	}

	setPlayerAndWorldCollider() {
		// Set up player collidors
		this.platform.setCollisionByProperty({collision: true})
		this.physics.add.collider(this.player.sprite, this.platform)
	}

	setWorldBounds() {
		this.physics.world.bounds.width = this.backLayer.width
		this.physics.world.bounds.height = this.backLayer.height
	}

	setDeathTiles() {
		// Kill if you fall in hole or touch anything black (Tile 39)
		this.platform.setTileIndexCallback(39, this.gameOver, this)
	}

	addHUD() {
		// Onscreen text. This is showing the score, for now
		this.scoreText = this.add
			.text(this.width / 2, this.height / 2 / 15, '0', {
				fontSize: '18px',
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setOrigin(0.5, 0.5)
			.setScrollFactor(0)
			.setText(`Level 1  Score: ${this.score}`)
		this.scoreText.alpha = 0.7
	}

	eventTriggers() {
		// Event Triggers - Storyline
		this.event1 = this.map.findObject('EventTrigger', obj => obj.name === 'Event1')
		this.event1 = this.map.findObject('EventTrigger', obj => obj.name === 'Event1')
		this.event2 = this.map.findObject('EventTrigger', obj => obj.name === 'Event2')
		this.event3 = this.map.findObject('EventTrigger', obj => obj.name === 'Event3')
		this.event4 = this.map.findObject('EventTrigger', obj => obj.name === 'Event4')
		this.eventArray = [this.event1, this.event2, this.event3, this.event4]
	}

	setCameraOptions() {
		// Camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
		this.cameras.main.startFollow(this.player.sprite)
		this.cameras.main.roundPixels = false
	}

	makeBackgroundAParalax() {
		this.backLayer.setScrollFactor(1)
		this.cityLayer1.setScrollFactor(0.99)
		this.cityLayer2.setScrollFactor(0.95)
		this.streetObject1.setScrollFactor(1)
		this.streetObject2.setScrollFactor(1)
		// This code is disabled. It allows for smooth camera slow-down
		// this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
	}

	loadLevelElements() {
		// Create the world (Level 1)
		this.map = this.make.tilemap({
			key: 'map',
			tileWidth: 16,
			tileHeight: 16
		})
		this.tileset = this.map.addTilesetImage('CityTileSet', 'cityTiles', 16, 16)
		this.tilesetHills = this.map.addTilesetImage('country-platform-back', 'Hills', 16, 16)
		this.backLayer = this.map.createStaticLayer('Background3', this.tilesetHills, 0, 0)
		this.cityLayer2 = this.map.createStaticLayer('Background2', this.tileset, 0, 0)
		this.cityLayer1 = this.map.createStaticLayer('Background1', this.tileset, 0, 0)
		// Create the player - Called here so they appear behind the lamps
		this.player = new Player(this)
		console.log(this.player)
		this.streetObject1 = this.map.createStaticLayer('StreetObjects', this.tileset, 0, 0)
		this.streetObject2 = this.map.createStaticLayer('StreetObjects2', this.tileset, 0, 0)
		this.platform = this.map.createStaticLayer('Platform', this.tileset, 0, 0)
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
