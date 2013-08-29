var Platonics = function() {

	var p = {

		//----------------------------------------
		// PRESETS
		//----------------------------------------

		modelLocation: 'assets/model/platonics2.obj',

		//----------------------------------------
		// VARIABLES
		//----------------------------------------

		model: null,
		listeners: {},
		textures: {},

		//----------------------------------------
		// PUBLIC METHODS
		//----------------------------------------

		/**
		 *	Initializes the class. Automatically called at instantiation.
		 */
		init: function() {
			
			_.bindAll(this, 'traverseTextures', 'onModelLoadComplete', 'addEventListener', 'removeEventListener', 'dispatchEvent' );

			// Object Loader
			var loader = new THREE.OBJLoader();
			loader.addEventListener('load', this.onModelLoadComplete);
			loader.load(this.modelLocation);
		},

		/**
         *  Adds callbacks on an event type.
         */
        addEventListener: function(type, callback) {
            if(!this.listeners[type])
            {
                this.listeners[type] = [];
            }

            var index = this.listeners[type].indexOf(callback);

            if(index >= 0)
                return;

            this.listeners[type].push(callback);
        },

        /**
         *  Removes callbacks on an event type.
         */
        removeEventListener: function(type, callback) {
            if(!this.listeners[type])
                return;

            var index = this.listeners[type].indexOf(callback);

            if(index < 0)
                return;

            this.listeners[type].splice(index, 1);
        },

        /**
         *  Calls any listeners on the event type and passes along the data.
         */
        dispatchEvent: function(type, data) {

            if(!this.listeners[type])
            {
                return;
            }

            for(var i = 0; i < this.listeners[type].length; i++)
            {
                var e = {type: type, target: this, data: data};
                this.listeners[type][i](e);
            }
        },

		//----------------------------------------
		// PRIVATE METHODS
		//----------------------------------------

		/**
         *  Traverses through an object and children updating materials.
         */
        traverseTextures: function(child) {

            if(child instanceof THREE.Mesh )
            {
                var material = new THREE.MeshNormalMaterial( { ambient: 0x000000, color: 0xcccccc, specular: 0x222222, shininess: 8 } );
                material.fog = false;
                material.wrapAround = 0.25;
                material.wrapRGB = new THREE.Vector3( 1, 0.8, 0.8 );
                material.perPixel = true;
                //material.map = this.textures[child.name];

                child.geometry.computeVertexNormals();
                child.material = material;
                child.castShadow = true;
                
            }
        },
	
		//----------------------------------------
		// EVENT HANDLERS
		//----------------------------------------

		/**
		 *	Complete handler for the model.
		 */
		onModelLoadComplete: function(event)
		{
			this.model = event.content;

			this.model.traverse( this.traverseTextures );

			//this.scene.add( this.model );
			this.model.scale.set(1, 1, 1);

			// Dispatch Model Load Complete
			this.dispatchEvent('loadComplete', {model: this.model});
		}
	};

	p.init();

	return p;
}