var AnimationFrame = {

	//----------------------------------------
	// Variables
	//----------------------------------------

	listeners: [],

	//----------------------------------------
	// Public Methods
	//----------------------------------------

	addListener: function(callback) {
		
		var runFrame = false;

		if(this.listeners.length < 1)
		{
			runFrame = true;
		}

		if(this.listeners.indexOf(callback) > -1)
		{
			return;
		}

		this.listeners.push(callback);

		if(runFrame)
		{
			this.onAnimationFrame();
		}
	},

	removeListener: function(callback) {

		var index = this.listeners.indexOf(callback);

		if(index > -1)
		{
			this.listeners.splice(index, 1);
		}
	},

	init: function () {

		_.bindAll(this, 'addListener', 'removeListener', 'onAnimationFrame');
		
		var vendors = ['webkit', 'moz'];
	    
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	    
		window.lastTime = 0;

	    if(!window.requestAnimationFrame)
	    {
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - window.lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall);
	            window.lastTime = currTime + timeToCall;
	            return id;
	        }
	    }
	    
	    if(!window.cancelAnimationFrame)
	    {
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        }
		}

		window.animationframe = this;
	},

	//----------------------------------------
	// Event Handlers
	//----------------------------------------

	onAnimationFrame: function(time) {

		var l = this.listeners.length;

		for(var i = 0; i < l; i++)
		{
			this.listeners[i](time);
		}

		if(l)
		{
			requestAnimationFrame(this.onAnimationFrame);
		}
	}

}