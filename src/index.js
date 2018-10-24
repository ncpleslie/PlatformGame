import Phaser from 'phaser'
import Level1 from './Levels/Level1.js'
import Level2 from './Levels/Level2.js'
import Menu from './Menu.js'
import Audio from './Audio.js'
import Pause from './Pause/Pause.js'
import Pause2 from './Pause/Pause2.js'
import Gameover from './Gameover.js'

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: 592,
	autoResize: true,
	resolution: window.devicePixelRatio || 1,
	parent: 'game-container',
	pixelArt: true,
	backgroundColor: '#FFFFFF',
	scene: [Menu, Audio, Pause, Pause2, Level1, Level2, Gameover],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000}
		}
	}
}

new Phaser.Game(config)
