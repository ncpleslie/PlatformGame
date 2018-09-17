import Phaser from 'phaser'

export default class Monster {
	constructor(scene, maxY, minY) {
		this.scene = scene
		this.enemyMaxY = maxY
		this.enemyMinY = minY // The bottom layer = 568
	}

	create() {
		// Bad Guys. Repeat will add more. 1 in at the moment
		this.badguy = this.scene.add.group({
			key: 'badguy',
			repeat: 0,
			setXY: {
				x: 1253,
				y: 568,
				stepX: 80,
				stepY: 20
			}
		})
		//Sets monster speed
		Phaser.Actions.Call(
			this.badguy.getChildren(),
			function(enemy) {
				enemy.speed = Math.random() * 2 + 1
			},
			this
		)
		// Scale the monster
		Phaser.Actions.ScaleXY(this.badguy.getChildren(), -0.5, -0.5)
	}

	update() {
		// Bad guys
		let enemies = this.badguy.getChildren()
		let numEnemies = enemies.length
		for (let i = 0; i < numEnemies; i++) {
			// move enemies
			enemies[i].y += enemies[i].speed
			if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
				enemies[i].speed *= -1
			} else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
				enemies[i].speed *= -1
			}
			// If you hit the enemy, you die
			if (
				Phaser.Geom.Intersects.RectangleToRectangle(
					this.scene.player.sprite.getBounds(),
					enemies[i].getBounds()
				)
			) {
				this.scene.gameOver()
				break
			}
		}
	}
}
