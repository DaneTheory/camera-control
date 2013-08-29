
var camera;
var motion;

$(function() {

	AnimationFrame.init();
	
	motion = new MotionCapture();
	camera = new CameraController(motion);
	
});