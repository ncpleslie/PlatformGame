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
		// Create the world (Level 1)
		const map = this.make.tilemap({
			key: 'map',
			tileWidth: 16,
			tileHeight: 16
		})
		const tileset = map.addTilesetImage('CityTileSet', 'cityTiles', 16, 16)
		const tilesetHills = map.addTilesetImage('country-platform-back', 'Hills', 16, 16)
		map.createStaticLayer('Background3', tilesetHills, 0, 0)
		map.createStaticLayer('Background2', tileset, 0, 0)
		map.createStaticLayer('Background1', tileset, 0, 0)
		map.createStaticLayer('StreetObjects', tileset, 0, 0)
		map.createStaticLayer('StreetObjects2', tileset, 0, 0)
		map.createStaticLayer('Platform', tileset, 0, 0)

		// Camera
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

		// Blur background

		// Onscreen text
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

			.setInteractive()
			.on('pointerdown', () => {
				this.scene.start('Menu')
			})

		// Call first level on any key
		this.input.keyboard.on('keyup', e => {
			this.scene.start('Menu')
		})
	}
}
