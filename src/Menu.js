import Phaser from 'phaser'
import Preloader from './Preloader.js'

export default class Menu extends Phaser.Scene {
	constructor() {
		super({
			key: 'Menu'
		})
		this.loadLevel = 'Level1'
	}

	preload() {
		this.width = this.cameras.main.width
		this.height = this.cameras.main.height

		let preloader = new Preloader(this)
		preloader.preload()
	}

	create() {
		// Audio
		this.loadAudio()
		// Load elements
		this.loadLevelElements()
		// Camera
		this.setCameraOptions()
		// Onscreen text
		this.addTextGameOver()
		this.addTextSubtitle()
		this.addControlText()
		// Make text a button
		this.makeSubTitleInteractive()
		this.continueOnAnyKey()
	}

	loadAudio() {
		this.audioScene = this.scene.get('Audio')
		this.menuSong = this.audioScene.loadSound('menuSong')
		this.audioScene.playSound(this.menuSong, true)
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
		this.map.createStaticLayer('Background3', this.tilesetHills, 0, 0)
		this.map.createStaticLayer('Background2', this.tileset, 0, 0)
		this.map.createStaticLayer('Background1', this.tileset, 0, 0)
		this.map.createStaticLayer('StreetObjects', this.tileset, 0, 0)
		this.map.createStaticLayer('StreetObjects2', this.tileset, 0, 0)
		this.map.createStaticLayer('Platform', this.tileset, 0, 0)
	}

	setCameraOptions() {
		// Camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
	}

	addTextGameOver() {
		// Onscreen text
		this.title = this.add
			.text(this.width / 2, this.height / 3, '', {
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setScrollFactor(0)
			.setOrigin(0.5, 0.5)
			.setText(`THE WIZARD SAVES THE CITY`)
			.setFontSize(`${this.width / 20}px`)
	}

	addTextSubtitle() {
		this.subTitle = this.add
			.text(this.width / 2, this.height / 2, '', {
				font: '18px monospace',
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setScrollFactor(0)
			.setOrigin(0.5, 0.5)
			.setText(`Press Any Key To Continue`)
			.setFontSize(`${this.width / 30}px`)
	}

	addControlText() {
		this.controlsText = this.add
			.text(this.width / 2, this.height / 8, '', {
				font: '18px monospace',
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setOrigin(0.5, 0.5)
		this.controlsText.alpha = 0.7
		this.controlsText.setText(
			`WASD/Arrows to move & jump
P to Pause`
		)
	}

	makeSubTitleInteractive() {
		this.subTitle.setInteractive()
		this.subTitle.on('pointerdown', () => {
			this.scene.start(this.loadLevel)
			this.audioScene.playSound(this.menuSong, false)
		})
	}

	continueOnAnyKey() {
		// Call first level on any key
		this.input.keyboard.on('keyup', e => {
			this.scene.start(this.loadLevel)
			this.audioScene.playSound(this.menuSong, false)
		})
	}
}
