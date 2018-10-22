import Phaser from 'phaser'

export default class Pause extends Phaser.Scene {
	constructor() {
		super({
			key: 'Pause'
		})
	}
	create() {
		this.input.keyboard.on('keyup', e => {
			if (e.key === 'p') {
				this.scene.pause()
				this.scene.resume('Level1')
			}
		})
	}
}
