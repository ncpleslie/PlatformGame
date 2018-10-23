import Phaser from 'phaser'
import Preloader from './Preloader.js'

export default class Gameover extends Phaser.Scene {
	constructor() {
		super({
			key: 'Gameover'
		})
		this.height = window.innerHeight
		this.width = window.innerWidth
	}

	preload() {
		let preloader = new Preloader(this)
		preloader.preload()

		// Load tile map locations
		this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/ncpleslie/PlatformGame/master/src/chch.json')
	}

	create() {
		// Load elements
		this.loadLevelElements()
		// Camera
		this.setCameraOptions()
		// Onscreen text
		this.addTextGameOver()
		this.addTextSubtitle()
		// Make text a button
		this.makeSubTitleInteractive()
		this.continueOnAnyKey()
	}

	loadLevelElements() {
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
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
	}

	addTextGameOver() {
		this.title = this.add
			.text(this.width / 2, this.height / 3, '', {
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setScrollFactor(0)
			.setOrigin(0.5, 0.5)
			.setText(`GAMEOVER`)
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

	makeSubTitleInteractive() {
		this.subTitle.setInteractive()
		this.subTitle.on('pointerdown', () => {
			this.scene.start('Menu')
		})
	}

	continueOnAnyKey() {
		// Call first level on any key
		this.input.keyboard.on('keyup', e => {
			this.scene.start('Menu')
		})
	}
}
