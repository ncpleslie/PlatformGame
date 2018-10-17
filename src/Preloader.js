export default class Preloader {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		const width = this.scene.cameras.main.width
		const height = this.scene.cameras.main.height

		// Build a loading bar
		const progressBar = this.scene.add.graphics()
		const progressBox = this.scene.add.graphics()
		progressBox.fillStyle(0x222222, 0.8)
		progressBox.fillRect(window.innerWidth / 4, window.innerHeight / 3, window.innerWidth / 2, 50)

		this.scene.load.on('progress', function(value) {
			// Loading bar
			progressBar.clear()
			progressBar.fillStyle(0xaeaeae, 1)
			progressBar.fillRect(window.innerWidth / 4, window.innerHeight / 3 + 10, (window.innerWidth / 2) * value, 30)
			// Text percentage
		})

		this.scene.load.on('fileprogress', function(file) {
			console.log(file.src)
		})

		this.scene.load.on('complete', function() {
			progressBar.destroy()
			progressBox.destroy()
		})
	}
}
