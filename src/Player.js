import Phaser from 'phaser'

export default class Player {
	constructor(fromScene) {
		// Player Animations
		fromScene.anims.create({
			key: 'left',
			frames: fromScene.anims.generateFrameNumbers('Player', {
				start: 0,
				end: 2
			}),
			frameRate: 10,
			repeat: -1
		})

		fromScene.anims.create({
			key: 'turn',
			frames: [
				{
					key: 'Player',
					frame: 8
				}
			],
			frameRate: 20
		})

		fromScene.anims.create({
			key: 'right',
			frames: fromScene.anims.generateFrameNumbers('Player', {
				start: 4,
				end: 6
			}),
			frameRate: 10,
			repeat: -1
		})

		fromScene.anims.create({
			key: 'up',
			frames: [
				{
					key: 'Player',
					frame: 9
				}
			],
			frameRate: 1,
			repeat: 10
		})

		fromScene.anims.create({
			key: 'rightJump',
			frames: [
				{
					key: 'Player',
					frame: 3
				}
			],
			frameRate: 1,
			repeat: 10
		})

		// Player settings
		this.sprite = fromScene.physics.add
			// Spawn location and player sprite
			.sprite(100, 450, 'Player', 0)
			.setBounce(0.2)
			.setGravityY(1000)

		// Set the keyboard controls.
		const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes
		this.keys = fromScene.input.keyboard.addKeys({
			left: LEFT,
			right: RIGHT,
			up: UP,
			w: W,
			a: A,
			d: D
		})
	}

	update() {
		// Player speed variables
		const leftRightVelocity = 160
		const jumpStrength = -550

		// Left. Move character. Play animation (Flipped)
		if (this.keys.left.isDown || this.keys.a.isDown) {
			this.sprite.setVelocityX(-leftRightVelocity)
			this.sprite.setFlipX(true)
			this.sprite.anims.play('left', true)

			// Right. Move character. Play animation
		} else if (this.keys.right.isDown || this.keys.d.isDown) {
			this.sprite.setVelocityX(leftRightVelocity)
			this.sprite.setFlipX(false)
			this.sprite.anims.play('right', true)

			// Stop. If no movement
		} else {
			this.sprite.setVelocityX(0)
			this.sprite.anims.play('turn')
		}

		// Jump
		if (
			(this.keys.up.isDown || this.keys.w.isDown) &&
			this.sprite.body.onFloor()
		) {
			this.sprite.setVelocityY(jumpStrength)
			this.sprite.anims.play('up')
			if (this.keys.right.isDown) {
				this.sprite.anims.play('rightJump')
			}
		}
	}
	destroy() {
		this.sprite.destroy()
	}
}
