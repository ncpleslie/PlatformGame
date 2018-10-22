import Phaser from 'phaser'

export default class Pause2 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Pause2'
		})
	}
	create() {
		this.input.keyboard.on('keyup', e => {
			if (e.key === 'p') {
				this.scene.pause()
				this.scene.resume('Level2')
			}
		})
	}
}
