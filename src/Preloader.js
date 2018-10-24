export default class Preloader {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		this.width = this.scene.cameras.main.width
		this.height = this.scene.cameras.main.height
		this.addText(this.width / 2, this.height / 2, `GAME LOADING`)
		this.addText(this.width / 2, this.height - 100, `Created By Nick Leslie`)
		this.createProgressBar()
		this.preloadProgress()
		this.preloadFileProgress()
		this.preloadComplete()
		this.loadGameElements()
	}

	addText(x, y, text) {
		this.title = this.scene.add
			.text(x, y, '', {
				fill: '#000000',
				padding: {x: 10, y: 10},
				backgroundColor: '#FFFFFF'
			})
			.setScrollFactor(0)
			.setOrigin(0.5, 0.5)
			.setText(text)
			.setFontSize(`${this.width / 20}px`)
	}

	createProgressBar() {
		this.progressBar = this.scene.add.graphics()
		this.progressBox = this.scene.add.graphics()
		this.progressBox.fillStyle(0x222222, 0.8)
		this.progressBox.fillRect(this.width / 4, this.height / 3, this.width / 2, 50)
	}

	preloadProgress() {
		this.scene.load.on('progress', value => {
			// Loading bar
			this.progressBar.clear()
			this.progressBar.fillStyle(0xaeaeae, 1)
			this.progressBar.fillRect(this.width / 4, this.height / 3 + 10, (this.width / 2) * value, 30)
		})
	}

	preloadFileProgress() {
		this.scene.load.on('fileprogress', file => {})
	}

	preloadComplete() {
		this.scene.load.on('complete', () => {
			this.progressBar.destroy()
			this.progressBox.destroy()
		})
	}

	loadGameElements() {
		// Player Specific Preload
		// Player Idle
		this.scene.load.image('PlayerIdle1', '../assets/player/idle/idle_1.png')
		this.scene.load.image('PlayerIdle2', '../assets/player/idle/idle_2.png')
		this.scene.load.image('PlayerIdle3', '../assets/player/idle/idle_3.png')
		this.scene.load.image('PlayerIdle4', '../assets/player/idle/idle_4.png')
		// Player Walk
		this.scene.load.image('PlayerWalk1', '../assets/player/walk/run_1.png')
		this.scene.load.image('PlayerWalk2', '../assets/player/walk/run_2.png')
		this.scene.load.image('PlayerWalk3', '../assets/player/walk/run_3.png')
		this.scene.load.image('PlayerWalk4', '../assets/player/walk/run_4.png')
		// Player Jump
		this.scene.load.image('PlayerJump1', '../assets/player/jump/jump_1.png')
		this.scene.load.image('PlayerJump2', '../assets/player/jump/jump_2.png')
		this.scene.load.image('PlayerJump3', '../assets/player/jump/jump_3.png')
		// Level Specific Preload
		this.scene.load.image('Hills', '../assets/country-platform-back.png')
		this.scene.load.image('cityTiles', '../assets/CityTileSet.png')
		this.scene.load.image('boomImage', '../assets/boom3.png')
		// Level 1
		this.scene.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/ncpleslie/PlatformGame/master/src/chch.json')
		// Level 2
		this.scene.load.tilemapTiledJSON('level2map', 'https://raw.githubusercontent.com/ncpleslie/PlatformGame/master/src/chch2.json')
		// Monster Sprites
		this.scene.load.image('badguy', '../assets/monster/zombie-NESW_10-small.png')
		this.scene.load.image('badguy0', '../assets/monster/zombie0.png')
		this.scene.load.image('badguy1', '../assets/monster/zombie1.png')
		this.scene.load.image('badguy2', '../assets/monster/zombie2.png')
		// Touch Screen Preload
		this.scene.load.image('touchArrow', '../assets/player/touch/arrow.png')
		this.scene.load.image('touchArrowUp', '../assets/player/touch/arrowup.png')
		// Sound
		this.scene.load.audio('jump', '../assets/sounds/jump.wav')
		this.scene.load.audio('gotCoin', '../assets/sounds/gotCoin.mp3')
		this.scene.load.audio('die', '../assets/sounds/die.mp3')
		this.scene.load.audio('menuSong', '../assets/sounds/menuSong.mp3')
		this.scene.load.audio('levelSong', '../assets/sounds/levelSong.mp3')
	}
}
