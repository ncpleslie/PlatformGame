import Phaser from 'phaser'

export default class Monster {
	constructor(scene, maxX, minX) {
		this.scene = scene
		this.enemyMaxX = maxX
		this.enemyMinX = minX // The bottom layer = 568
		this.monsterSpeed = 0.5
	}

	create() {
		// Bad Guys. Repeat will add more. 1 in at the moment
		this.badguy = this.scene.add.group({
			key: 'badguy',
			frameRate: 10,
			repeat: -1,
			// Follow lines disabled due to trying to get hit areas to work
			//hitarea: new Phaser.Geom.Rectangle(0, 0, 128, 128),
			//hitAreaCallback: Phaser.Geom.Rectangle.Contains,
			setXY: {
				x: this.enemyMaxX,
				y: 517,
				stepX: 300,
				stepY: 0
			}
		})
		//Sets monster speed
		Phaser.Actions.Call(
			this.badguy.getChildren(),
			function(enemy) {
				enemy.speed = this.monsterSpeed
			},
			this
		)
		// Scale the monster

		Phaser.Actions.ScaleXY(this.badguy.getChildren(), 0, 0)
	}

	update() {
		// Bad guys
		let enemies = this.badguy.getChildren()
		let numEnemies = enemies.length
		for (let i = 0; i < numEnemies; i++) {
			// move enemies

			enemies[i].x += enemies[i].speed
			if (enemies[i].x >= this.enemyMaxX && enemies[i].speed > 0) {
				enemies[i].speed *= -1
			} else if (enemies[i].x <= this.enemyMinX && enemies[i].speed < 0) {
				enemies[i].speed *= -1
			}
			// If you hit the enemy, you die
			if (Phaser.Geom.Intersects.RectangleToRectangle(this.scene.player.sprite.getBounds(), enemies[i].getBounds())) {
				this.scene.gameOver()
				break
			}
		}
	}
}
