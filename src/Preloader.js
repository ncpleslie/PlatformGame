export default class Preloader {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		const height = this.scene.cameras.main.height

		// Build a loading bar
		const progressBar = this.scene.add.graphics()
		const progressBox = this.scene.add.graphics()
		progressBox.fillStyle(0x222222, 0.8)
		progressBox.fillRect(window.innerWidth / 4, height / 3, window.innerWidth / 2, 50)

		this.scene.load.on('progress', function(value) {
			// Loading bar
			progressBar.clear()
			progressBar.fillStyle(0xaeaeae, 1)
			progressBar.fillRect(window.innerWidth / 4, height / 3 + 10, (window.innerWidth / 2) * value, 30)
			// Text percentage
		})

		this.scene.load.on('fileprogress', function(file) {})

		this.scene.load.on('complete', function() {
			progressBar.destroy()
			progressBox.destroy()
		})

		// Load images
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

		// Monster Sprites
		this.scene.load.spritesheet('badguy', '../assets/monster/zombie-NESW.png', {
			frameWidth: 24,
			frameHeight: 32
		})
		this.scene.load.image('badguy0', '../assets/monster/zombie0.png')
		this.scene.load.image('badguy1', '../assets/monster/zombie1.png')
		this.scene.load.image('badguy2', '../assets/monster/zombie2.png')

		// Touch Screen Preload
		this.scene.load.image('touchArrow', '../assets/player/touch/arrow.png')
		this.scene.load.image('touchArrowUp', '../assets/player/touch/arrowup.png')
	}
}
