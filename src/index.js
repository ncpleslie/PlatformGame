import Phaser from 'phaser'
import Level1 from './Level1.js'
import Menu from './Menu.js'
import Pause from './Pause.js'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	resolution: window.devicePixelRatio || 1,
	parent: 'game-container',
	pixelArt: true,
	backgroundColor: '#FFFFFF',
	scene: [Menu, Pause, Level1],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000}
		}
	}
}
const game = new Phaser.Game(config)
