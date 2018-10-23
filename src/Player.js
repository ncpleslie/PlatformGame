import Phaser from 'phaser'
import Touch from './Touch.js'

export default class Player {
	constructor(fromScene) {
		this.scene = fromScene
		// Player Animations
		fromScene.anims.create({
			key: 'right-left',
			frames: [{key: 'PlayerWalk1'}, {key: 'PlayerWalk2'}, {key: 'PlayerWalk3'}, {key: 'PlayerWalk4'}],
			frameRate: 10,
			repeat: -1
		})

		fromScene.anims.create({
			key: 'jump',
			frames: [{key: 'PlayerJump1'}, {key: 'PlayerJump2'}, {key: 'PlayerJump3'}],
			frameRate: 10,
			repeat: -1
		})

		fromScene.anims.create({
			key: 'idle',
			frames: [{key: 'PlayerIdle1'}, {key: 'PlayerIdle2'}, {key: 'PlayerIdle3'}, {key: 'PlayerIdle4'}],
			frameRate: 4,
			repeat: -1
		})

		// Player settings
		this.sprite = fromScene.physics.add
			// Spawn location and player sprite
			.sprite(100, 450, 'Player', 0)
			.setBounce(0.2)
			.setGravityY(1000)
			.setCollideWorldBounds(true)

		// Set the keyboard controls.
		const {LEFT, RIGHT, UP, W, A, D} = Phaser.Input.Keyboard.KeyCodes
		this.keys = fromScene.input.keyboard.addKeys({
			left: LEFT,
			right: RIGHT,
			up: UP,
			w: W,
			a: A,
			d: D
		})

		this.touchControls = new Touch(fromScene)
		this.touchControls.create()
	}

	update() {
		this.touchControls.update()
		// Player speed variables
		const leftRightVelocity = 160
		const jumpStrength = -550

		// Left. Move character. Play animation (Flipped)
		if (this.keys.left.isDown || this.keys.a.isDown || this.touchControls.leftButtonPressed) {
			this.movementController(-leftRightVelocity, 0, true, 'right-left')
			// Right. Move character. Play animation
		} else if (this.keys.right.isDown || this.keys.d.isDown || this.touchControls.rightButtonPressed) {
			this.movementController(leftRightVelocity, 0, false, 'right-left')

			// Stop. If no movement
		} else {
			this.movementController(0, 0, false, 'idle')
		}
		// Jump
		if ((this.keys.up.isDown || this.keys.w.isDown || this.touchControls.upButtonPressed) && this.sprite.body.onFloor()) {
			this.movementController(null, jumpStrength, false, 'jump')
		}
	}

	destroy() {
		this.sprite.destroy()
	}

	movementController(velocityX, velocityY, flipOnX, animation) {
		this.sprite.setVelocityX(velocityX)
		if (velocityY) {
			this.sprite.setVelocityY(velocityY)
		}
		this.sprite.setFlipX(flipOnX)
		this.sprite.anims.play(animation, true)
	}
}
