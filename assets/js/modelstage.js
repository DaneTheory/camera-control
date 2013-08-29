var ModelStage = function(element) {

	var m = {

		//----------------------------------------
		// VARIABLES
		//----------------------------------------

		wndw: {
			width: window.innerWidth,
			height: window.innerHeight,
			centerX: window.innerWidth * 0.5,
			centerY: window.innerHeight * 0.5,
		},

		element: element,
		stats: null,
		camera: null,
		scene: null,
		renderer: null,
		mouse: {x: 0, y: 0},
		clock: new THREE.Clock(),
		press: null,
		dragging: false,
		dragData: null,
		startDrag: {x: 0, y: 0},
		spaceHold: false,
		platonics: null,
		cameraPositionSmooth: new SpringSmooth3(),
		cameraRotationSmooth: new SpringSmooth3(),
		paired: false,

		//----------------------------------------
		// Public Methods
		//----------------------------------------

		init: function() {
			
			_.bindAll(this, 'addListeners', 'removeListeners', 'onUpdate', 'onResize', 'render', 'onStagePress', 'onStageDrag', 'onStageRelease', 'onMouseWheel', 'onKeyPress', 'onKeyRelease', 'onPlatonicsLoadComplete', 'onMoveUpdate');

			this.press = new PressControl($(this.element));
			this.press.addEventListener('dragStart', this.onStagePress);
			this.press.addEventListener('dragUpdate', this.onStageDrag);
			this.press.addEventListener('dragStop', this.onStageRelease);
			this.press.addEventListener('moveUpdate', this.onMoveUpdate);
			$(this.element).css({cursor: 'all-scroll'});

			this.press.rectangle.top = 0;
			this.press.rectangle.bottom = window.innerHeight;
			this.press.rectangle.left = 0;
			this.press.rectangle.right = window.innerWidth;

			// Scene
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0xffffff, 2000, 5000 );

			// Camera
			this.camera = new THREE.PerspectiveCamera( 35, this.wndw.width / this.wndw.height, 1, 25000 );
			//this.camera.useQuaternion = true;
			this.scene.add( this.camera );

			this.cameraPositionSmooth.target.z = this.cameraPositionSmooth.position.z = 500;
			this.cameraRotationSmooth.target.x = this.cameraRotationSmooth.position.x = 90;

			//Lights
			var ambient = new THREE.AmbientLight( 0xAAAAAA );
			this.scene.add( ambient );

			// Renderer
			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			this.renderer.setSize( this.wndw.width, this.wndw.height );

			this.element.appendChild( this.renderer.domElement );

			// Stats
			this.stats = new Stats();
			this.element.appendChild( this.stats.domElement );

			// Model
			this.platonics = new Platonics();
			this.platonics.addEventListener('loadComplete', this.onPlatonicsLoadComplete);

			// Initial Event Listeners
			this.addListeners();
		},

		addListeners: function() {

			document.addEventListener("mousewheel", this.onMouseWheel, false);
			document.addEventListener("DOMMouseScroll", this.onMouseWheel, false);

			$(document).bind('keydown', this.onKeyPress);
			$(document).bind('keyup', this.onKeyRelease);

			window.addEventListener('resize', this.onResize, false);
			window.animationframe.addListener(this.onUpdate);
		},

		removeListeners: function() {

			document.removeEventListener("mousewheel", this.onMouseWheel);
			document.removeEventListener("DOMMouseScroll", this.onMouseWheel);

			$(document).unbind('keydown', this.onKeyPress);
			$(document).unbind('keyup', this.onKeyRelease);

			window.removedEventListener('resize', this.onResize, false);
			window.animationframe.removeListener(this.onUpdate);
		},

		//----------------------------------------
		// Private Methods
		//----------------------------------------

		render: function() {
			var delta = this.clock.getDelta();

			this.cameraRotationSmooth.update(delta);

			var x = this.cameraRotationSmooth.position.x;
			var y = this.cameraRotationSmooth.position.y;
			var z = this.cameraRotationSmooth.position.z;

			var tempQuaternion = new THREE.Quaternion();
			//this.camera.quaternion.setFromAxisAngle( new THREE.Vector3(1, 0, 0), x);
			//this.camera.quaternion.setFromAxisAngle( new THREE.Vector3(0, 1, 0), y);
			
			//tempQuaternion.setFromAxisAngle( new THREE.Vector3(1, 0, 0), x);
			//this.camera.quaternion.multiply(tempQuaternion);
			//this.camera.quaternion.normalize();
			
			//var tmpQuaternion = new THREE.Quaternion();
			//tmpQuaternion.set(x, y, z, 1).normalize();
			//this.camera.quaternion.multiply(tmpQuaternion);

			/*
			var quaternionY = new THREE.Quaternion();
			quaternionY.setFromAxisAngle( new THREE.Vector3(0, 0, 1), y);
			var quaternionX = new THREE.Quaternion();
			quaternionX.setFromAxisAngle( new THREE.Vector3(1, 0, 0), x);
			quaternionY.multiply(quaternionX);
			this.camera.rotation.setEulerFromQuaternion( quaternionY );
			*/


			this.camera.rotation.x = this.cameraRotationSmooth.position.x;
			this.camera.rotation.y = this.cameraRotationSmooth.position.y;
			this.camera.rotation.z = this.cameraRotationSmooth.position.z;

			this.cameraPositionSmooth.update(delta);
			this.camera.position.x = this.cameraPositionSmooth.position.x;
			this.camera.position.y = this.cameraPositionSmooth.position.y;
			this.camera.position.z = this.cameraPositionSmooth.position.z;

			this.renderer.render( this.scene, this.camera );

		},

		//----------------------------------------
		// Event Handlers
		//----------------------------------------

		onPlatonicsLoadComplete: function(event) {
			this.scene.add( event.data.model );
		},

		onKeyPress: function(event) {
			switch(event.keyCode)
			{
				case 32:
					// space
					this.spaceHold = true;
					break;
				case 37:
					// left
					break;
				case 38:
					// up
					break;
				case 39:
					// right
					break;
				case 40:
					// down
					break;
			}
		},

		onKeyRelease: function(event) {
			switch(event.keyCode)
			{
				case 32:
					// space
					this.spaceHold = false;
					break;
				case 37:
					// left
					break;
				case 38:
					// up
					break;
				case 39:
					// right
					break;
				case 40:
					// down
					break;
			}
		},

		onMoveUpdate: function(event) {

		},

		onStagePress: function(event) {
			
			this.dragging = true;
		},

		onStageDrag: function(event) {

			if(this.paired)
				return;

			this.dragData = event.data;

			if(this.spaceHold)
			{
				this.cameraYSmooth.target += this.dragData.difference.y;
				this.cameraYSmooth.target = this.clamp(41, 380, this.cameraYSmooth.target);
			}
			 else
			{
				this.cameraRotationSmooth.target.y -= (-this.dragData.difference.pctX * 360) * MathUtils.DegreesToRadians;
				//this.cameraYawSmooth.target = this.clamp(-1.5, 1.5, this.cameraYawSmooth.target);
				this.cameraRotationSmooth.target.x -= (-this.dragData.difference.pctY * 360) * MathUtils.DegreesToRadians;
				//this.cameraPitchSmooth.target = this.clamp(-0.75, 0.02, this.cameraPitchSmooth.target);
			}
		},

		onStageRelease: function(event) {

			this.dragging = false;
		},

		onUpdate: function() {
			this.render();
			this.stats.update();
		},

		onMouseWheel: function(event) {

			var deltaX = event.wheelDeltaX / 6;
			var deltaY = event.wheelDeltaY / 6;
			var inverted = (event.webkitDirectionInvertedFromDevice == 'true' || event.webkitDirectionInvertedFromDevice == true) ? -1 : 1;
			
			if(this.stageState == "normal"){
				this.cameraDistanceSmooth.target = this.clamp(200, 2000, this.cameraDistanceSmooth.target + deltaY * inverted);
			}
		},

		onResize: function(event) {
			this.wndw.width = window.innerWidth;
			this.wndw.height = window.innerHeight;
			this.wndw.centerX = window.innerWidth * 0.5;
			this.wndw.centerY = window.innerHeight * 0.5;
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );

			this.press.rectangle.top = 0;
			this.press.rectangle.bottom = this.wndw.height;
			this.press.rectangle.left = 0;
			this.press.rectangle.right = this.wndw.width;
		}
	};

	m.init();

	return m;
}
