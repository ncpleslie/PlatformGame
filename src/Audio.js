import Phaser from 'phaser'
export default class Audio extends Phaser.Scene {
	constructor() {
		super({
			key: 'Audio'
		})
		this.loadSound = sound => {
			return this.sound.add(sound)
		}

		this.playSound = (sound, playing) => {
			if (playing) {
				sound.play()
			}
			if (!playing) {
				sound.stop()
			}
		}
	}
}
