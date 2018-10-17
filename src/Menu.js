import Phaser from 'phaser'
import Preloader from './Preloader.js'
import {game} from './index.js'

export default class Menu extends Phaser.Scene {
	constructor() {
		super({
			key: 'Menu'
		})
		this.height = window.innerHeight
		this.width = window.innerWidth
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
			.setText(`THE WIZARD SAVES THE CITY`)
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
				this.scene.start('Level1')
			})

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

		// Call first level on any key
		this.input.keyboard.on(
			'keyup',
			function(e) {
				this.scene.start('Level1')
			},
			this
		)
	}
}
