var MotionCapture = function() {
	
	var m = {

		gyro: {
			x: 0,
			y: 0,
			z: 0,
			alpha: 0,
			beta: 0,
			gamma: 0,
			multiplier: 2,
			tilt: 30
		},

		acceleration: {
			x: 0,
			y: 0,
			z: 0,
			gx: 0,
			gy: 0,
			gz: 0,
			alpha: 0,
			beta: 0,
			gamma: 0
		},

		orientation: 0,
		
		init: function() {
			_.bindAll(this, 'destroy', 'onDeviceOrientation', 'onOrientationChange', 'onDeviceMotion');

			window.addEventListener('deviceorientation', this.onDeviceOrientation, false);
			window.addEventListener('orientationchange', this.onOrientationChange, false);
			window.addEventListener('devicemotion', this.onDeviceMotion, false);
			this.orientation = window.orientation;
		},
		
		destroy: function() {

		},

		//----------------------------------------
		// EVENT HANDLERS
		//----------------------------------------

		onDeviceOrientation: function(event) {
			
			switch(this.orientation)
			{
				case 90:
					this.gyro.beta = event.beta;
					this.gyro.gamma = -event.gamma - this.gyro.tilt;
					this.gyro.alpha = 180 - (event.alpha + 180) % 360;
					break;

				case 180:
					this.gyro.beta = -event.beta - this.gyro.tilt;
					this.gyro.gamma = event.gamma;
					this.gyro.alpha = 180 - (event.alpha) % 360;
					break;

				case -90:
					this.gyro.beta = -event.beta;
					this.gyro.gamma = event.gamma - this.gyro.tilt;
					this.gyro.alpha = 180 - (event.alpha + 180) % 360;
					break;

				case 0:
				default:
					this.gyro.beta = event.beta - this.gyro.tilt;
					this.gyro.gamma = event.gamma;
					this.gyro.alpha = 180 - (event.alpha + 180) % 360;
					break;
			}

			this.gyro.x = this.gyro.gamma * this.gyro.multiplier;
			this.gyro.y = this.gyro.beta * this.gyro.multiplier;
			this.gyro.z = this.gyro.alpha;

		},

		onOrientationChange: function(event) {
			this.orientation = orientation;
		},

		onDeviceMotion: function(event) {
			
			this.acceleration.x = event.acceleration.x;
			this.acceleration.y = event.acceleration.y;
			this.acceleration.z = event.acceleration.z;

			this.acceleration.gx = event.accelerationIncludingGravity.x;
			this.acceleration.gy = event.accelerationIncludingGravity.y;
			this.acceleration.gz = event.accelerationIncludingGravity.z;

			this.acceleration.alpha = event.rotationRate.alpha;
			this.acceleration.beta = event.rotationRate.beta;
			this.acceleration.gamma = event.rotationRate.gamma;
		}

	}

	m.init();

	return m;
}