/* This is for displaying touch controls at the bottom of  the screen */

export default class Touch {
	constructor(scene) {
		this.scene = scene
		this.leftButtonPressed = false
		this.rightButtonPressed = false
		this.upButtonPressed = false
		this.leftButton = null
		this.rightButton = null
		this.upButton = null
	}

	create() {
		// https://photonstorm.github.io/phaser3-docs/Phaser.Device.html
		// Checks to see if touch device. Then displays touch controls
		if (this.scene.sys.game.device.input.touch) {
			this.leftButton = this.scene.add
				.sprite(100, 565, 'touchArrow')
				.setFlipX(true)
				.setInteractive()
				.setScale(0.5)
				.setScrollFactor(0)
			this.leftButton.depth = 100

			this.rightButton = this.scene.add
				.sprite(window.innerWidth - 100, 565, 'touchArrow')
				.setInteractive()
				.setScale(0.5)
				.setScrollFactor(0)
			this.rightButton.depth = 100

			this.upButton = this.scene.add
				.sprite(window.innerWidth / 2, 565, 'touchArrowUp')
				.setInteractive()
				.setScale(0.5)
				.setScrollFactor(0)
			this.upButton.depth = 100

			// Adds multi-touch support (Up to 4 inputs)
			this.scene.input.addPointer(3)
		}
	}

	update() {
		if (this.scene.sys.game.device.input.touch) {
			this.leftButton.on('pointerdown', () => {
				this.leftButtonPressed = true
			})
			this.leftButton.on('pointerup', () => {
				this.leftButtonPressed = false
			})

			this.rightButton.on('pointerdown', () => {
				this.rightButtonPressed = true
			})

			this.rightButton.on('pointerup', () => {
				this.rightButtonPressed = false
			})

			this.upButton.on('pointerdown', () => {
				this.upButtonPressed = true
			})

			this.upButton.on('pointerup', () => {
				this.upButtonPressed = false
			})
		}
	}
}
