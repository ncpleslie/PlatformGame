import Phaser from 'phaser'
import Level1 from './level1.js'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	pixelArt: true,
	backgroundColor: '#1d212d',
	scene: [Level1],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 }
		}
	}
}
const game = new Phaser.Game(config)
