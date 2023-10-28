import { MPPAgent } from ".";

interface Vector2 {
	x: number;
	y: number;
}

interface CursorProps {
	currentAnimation: string;
	position: Vector2;
	oldPosition: Vector2;
	velocity: Vector2;
	acceleration: Vector2;
	t: number;
	ot: number;
	dt: number;
	gravity: number;
	angles: number[];
	following: string;
}

export class Cursor {
	public visible: boolean = true;
	public displayInterval: NodeJS.Timeout;
	public updateInterval: NodeJS.Timeout;

	public props: CursorProps = {
		currentAnimation: "test2",
		position: {
			x: 50,
			y: 50
		},
		oldPosition: {
			x: 0,
			y: 0
		},
		velocity: {
			x: 2 / 5,
			y: 2 / 7
		},
		acceleration: {
			x: 0,
			y: 0
		},
		t: Date.now(),
		ot: Date.now(),
		dt: 0,
		gravity: 98,
		angles: [],
		following: ""
	};

	constructor(public agent: MPPAgent) {
		this.displayInterval = setInterval(() => {
			if (
				this.props.oldPosition.x !== this.props.position.x ||
				this.props.oldPosition.y !== this.props.position.y
			) {
				this.agent.client.sendArray([
					{
						m: "m",
						x: this.props.position.x.toFixed(2).toString(),
						y: this.props.position.y.toFixed(2).toString()
					}
				]);
			}
		}, 1000 / 20);

		this.updateInterval = setInterval(() => {
			switch (this.props.currentAnimation) {
				case "bounce":
					this.props.oldPosition.x = this.props.position.x;
					this.props.oldPosition.y = this.props.position.y;
					this.props.t = Date.now();
					this.props.dt = (this.props.t - this.props.ot) / 1000;

					this.props.acceleration.x = Math.random() * 100 - 50;

					if (this.props.position.y < 75) {
						this.props.acceleration.y =
							Math.random() * 100 - 50 + this.props.gravity;
					} else {
						this.props.acceleration.y = -(Math.random() * 50);
					}

					this.props.velocity.x +=
						this.props.acceleration.x * this.props.dt;
					this.props.velocity.y +=
						this.props.acceleration.y * this.props.dt;

					this.props.position.x +=
						this.props.velocity.x * this.props.dt;
					this.props.position.y +=
						this.props.velocity.y * this.props.dt;

					if (
						this.props.position.x >= 100 ||
						this.props.position.x <= 0
					) {
						this.props.velocity.x = -this.props.velocity.x;
					}

					if (
						this.props.position.y >= 100 ||
						this.props.position.y <= 0
					) {
						this.props.velocity.y = -this.props.velocity.y;
					}

					if (
						this.props.position.x <= -5 ||
						this.props.position.x >= 105
					) {
						this.props.position.x = 50;
						this.props.velocity.x = 0;
					}

					if (
						this.props.position.y <= -5 ||
						this.props.position.y >= 105
					) {
						this.props.position.y = 50;
						this.props.velocity.y = 0;
					}

					this.props.ot = Date.now();
					break;
				case "bounce2":
					this.props.oldPosition.x = this.props.position.x;
					this.props.oldPosition.y = this.props.position.y;
					this.props.t = Date.now();
					this.props.dt = (this.props.t - this.props.ot) / 1000;

					this.props.acceleration.x = Math.random() * 100 - 50;

					if (this.props.position.y < 75) {
						this.props.acceleration.y =
							Math.random() * 100 - 50 - this.props.gravity;
					} else {
						this.props.acceleration.y = -(Math.random() * 50);
					}

					this.props.velocity.x +=
						this.props.acceleration.x * this.props.dt;
					this.props.velocity.y +=
						this.props.acceleration.y * this.props.dt;

					this.props.position.x +=
						this.props.velocity.x * this.props.dt;
					this.props.position.y +=
						this.props.velocity.y * this.props.dt;

					if (
						this.props.position.x >= 100 ||
						this.props.position.x <= 0
					) {
						this.props.velocity.x = -this.props.velocity.x;
					}

					if (
						this.props.position.y >= 100 ||
						this.props.position.y <= 0
					) {
						this.props.velocity.y = -this.props.velocity.y;
					}

					if (
						this.props.position.x <= -5 ||
						this.props.position.x >= 105
					) {
						this.props.position.x = 50;
						this.props.velocity.x = 0;
					}

					if (
						this.props.position.y <= -5 ||
						this.props.position.y >= 105
					) {
						this.props.position.y = 50;
						this.props.velocity.y = 0;
					}

					this.props.ot = Date.now();
					break;
				case "constrained":
					this.props.oldPosition.x = this.props.position.x;
					this.props.oldPosition.y = this.props.position.y;
					this.props.t = Date.now();
					this.props.dt = (this.props.t - this.props.ot) / 1000;

					this.props.acceleration.x = Math.random() * 100 - 50;

					this.props.velocity.x +=
						this.props.acceleration.x * this.props.dt;

					this.props.position.x +=
						this.props.velocity.x * this.props.dt;

					if (
						this.props.position.x >= 100 ||
						this.props.position.x <= 0
					) {
						this.props.velocity.x = -this.props.velocity.x;
					}

					if (
						this.props.position.y >= 100 ||
						this.props.position.y <= 0
					) {
						this.props.velocity.y = -this.props.velocity.y;
					}

					if (
						this.props.position.x <= -5 ||
						this.props.position.x >= 105
					) {
						this.props.position.x = 50;
						this.props.velocity.x = 0;
					}

					if (
						this.props.position.y <= -5 ||
						this.props.position.y >= 105
					) {
						this.props.position.y = 50;
						this.props.velocity.y = 0;
					}

					this.props.ot = Date.now();
					break;
				case "lemniscate":
					if (!this.props.angles[0]) this.props.angles[0] = 0;

					this.props.angles[0] += 1;
					if (this.props.angles[0] > 360) this.props.angles[0] = 0;

					this.props.position.x =
						Math.cos(this.props.angles[0] * (Math.PI / 180)) * 10 +
						50;
					this.props.position.y =
						Math.sin(this.props.angles[0] * (Math.PI / 180) * 3) *
							10 +
						50;

					break;
				case "test":
					if (!this.props.angles[0]) this.props.angles[0] = 0;

					this.props.angles[0] += 2;
					if (this.props.angles[0] > 360) this.props.angles[0] = 0;

					this.props.position.x =
						Math.cos(this.props.angles[0] * (Math.PI / 180)) * 10 +
						50;
					this.props.position.y =
						Math.sin(this.props.angles[0] * (Math.PI / 180) * 2) *
							10 +
						50;

					break;
				case "test2":
					this.props.oldPosition.x = this.props.position.x;
					this.props.oldPosition.y = this.props.position.y;
					this.props.t = Date.now();
					this.props.dt = (this.props.t - this.props.ot) / 1000;

					if (this.props.velocity.x > 10)
						this.props.velocity.x = 2 / 5;
					if (this.props.velocity.x < -10)
						this.props.velocity.x = -(2 / 5);
					if (this.props.velocity.y > 10)
						this.props.velocity.y = 2 / 7;
					if (this.props.velocity.y < -10)
						this.props.velocity.y = -(2 / 7);

					this.props.position.x +=
						this.props.velocity.x * this.props.dt * 10;
					this.props.position.y +=
						this.props.velocity.y * this.props.dt * 10;

					if (
						this.props.position.x >= 100 ||
						this.props.position.x <= 0
					) {
						this.props.velocity.x = -this.props.velocity.x;
					}

					if (
						this.props.position.y >= 100 ||
						this.props.position.y <= 0
					) {
						this.props.velocity.y = -this.props.velocity.y;
						console.log(this.props.velocity, "setting!!!");
					}

					this.props.ot = Date.now();

					break;
			}
		}, 1000 / 60);
	}

	public show() {
		this.visible = true;
	}

	public hide() {
		this.visible = false;
	}
}
