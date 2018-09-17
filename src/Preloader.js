export default class Preloader {
	constructor(scene) {
		this.scene = scene
	}

	preload() {
		// Build a loading bar
		const progressBar = this.scene.add.graphics()
		const progressBox = this.scene.add.graphics()
		progressBox.fillStyle(0x222222, 0.8)
		progressBox.fillRect(240, 270, 320, 50)

		// Loading Text
		const width = this.scene.cameras.main.width
		const height = this.scene.cameras.main.height
		const loadingText = this.scene.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		})
		loadingText.setOrigin(0.5, 0.5)

		// Loading Percentage
		let percentText = this.scene.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		})
		percentText.setOrigin(0.5, 0.5)

		this.scene.load.on('progress', function(value) {
			// Loading bar
			progressBar.clear()
			progressBar.fillStyle(0xffffff, 1)
			progressBar.fillRect(250, 280, 300 * value, 30)
			// Text percentage
			percentText.setText(parseInt(value * 100) + '%')
		})

		this.scene.load.on('fileprogress', function(file) {
			console.log(file.src)
		})

		this.scene.load.on('complete', function() {
			progressBar.destroy()
			progressBox.destroy()
			loadingText.destroy()
			percentText.destroy()
		})

		// Load images
		this.scene.load.image('Asset', 'https://i.imgur.com/jdqWEYB.png')
		this.scene.load.image('Sky', 'https://i.imgur.com/fhFpcKN.png')
		this.scene.load.image('Grass', 'https://i.imgur.com/rGPlCE8.png')
		this.scene.load.image('tiles', 'https://i.imgur.com/JZKNeJO.png')
		this.scene.load.spritesheet(
			'badguy',
			'https://i.imgur.com/HKgScVP.png',
			{
				frameWidth: 42,
				frameHeight: 32
			}
		)
		// Load tile map locations
		this.scene.load.tilemapTiledJSON(
			'map',
			'https://raw.githubusercontent.com/ncpleslie/SoftEngAssignment2/master/fork/scenes/level1.json'
		)
	}
}
