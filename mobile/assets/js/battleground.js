/* 
	BattleGround is the class used to connect to the NodeJS 'SwordFight' app. It sends and receives player information
	to and from the app and handles displaying visuals.
*/

var BattleGround = function() {

	var b = {

		//----------------------------------------
		// Variables
		//----------------------------------------

		socket: null,
		warriors: {},
		connected: false,
		$container: null,
		warrior: null,

		//----------------------------------------
		// Public Methods
		//----------------------------------------

		init: function() {
			
			_.bindAll(this, 'destroy', 'onSocketConnection', 'addListeners', 'removeListeners', 'onInitialState', 'onDisconnect', 'onBattlePulse', 'onUpdate', 'onMouseMove', 'broadcastPosition', 'addInitialWarriors', 'onAddWarrior', 'onRemoveWarrior', 'onMouseDown', 'onMouseUp');
			
			this.socket = io.connect('http://slayingthebeast.com:8080');
			this.socket.on('connect', this.onSocketConnection);

			this.$container = $('.battleground');

			$(document).bind('mousemove', this.onMouseMove);
			$(document).bind('mousedown', this.onMouseDown);
			$(document).bind('mouseup', this.onMouseUp);

			window.animationframe.addListener(this.onUpdate);
		},

		destroy: function() {

		},

		addListeners: function() {

			this.socket.addListener('initial-state', this.onInitialState);
			this.socket.addListener('pulse', this.onBattlePulse);
			this.socket.addListener('add-warrior', this.onAddWarrior);
			this.socket.addListener('remove-warrior', this.onRemoveWarrior);
			this.socket.addListener('disconnect', this.onDisconnect);

		},

		removeListeners: function() {

			this.socket.removeListener('initial-state', this.onInitialState);
			this.socket.removeListener('pulse', this.onBattlePulse);
			this.socket.removeListener('add-warrior', this.onAddWarrior);
			this.socket.removeListener('remove-warrior', this.onRemoveWarrior);
			this.socket.removeListener('disconnect', this.onDisconnect);

		},

		broadcastPosition: function() {
			if(this.warrior)
			{
				this.socket.emit('warrior-position', {x: this.warrior.x, y: this.warrior.y, name: this.warrior.name, id: this.warrior.id});
			}
		},

		addInitialWarriors: function(warriors) {

			this.warriors = {};

			var warrior;

			for(var w in warriors)
			{
				warrior = new Warrior(this.$container);
				warrior.name = warriors[w].name;
				warrior.id = warriors[w].id;
				warrior.addWeapon(warriors[w].weapon);
				warrior.x = warriors[w].x;
				warrior.y = warriors[w].y;
				this.warriors[warrior.id] = warrior;
			}
		},

		//----------------------------------------
		// Event Handlers
		//----------------------------------------

		onSocketConnection: function() {

			this.connected = true;

			this.addListeners();

			this.socket.emit('request-state');
			
		},

		onInitialState: function(data) {

			this.addInitialWarriors(data.warriors);

			this.warrior = this.warriors[data.id];
		},

		onBattlePulse: function(data) {

			var warrior;

			for(var w in data.warriors)
			{
				warrior = this.warriors[w];

				if(warrior)
				{
					warrior.x = data.warriors[w].x;
					warrior.y = data.warriors[w].y;
				}
			}
		},

		onUpdate: function() {

			this.broadcastPosition();

			for(var w in this.warriors)
			{
				this.warriors[w].update();
			}
			
		},

		onMouseMove: function(event) {

			if(this.warrior)
			{
				this.warrior.x = event.pageX;
				this.warrior.y = event.pageY;
			}
		},

		onMouseDown: function(event) {
			//
		},

		onMouseUp: function(event) {
			this.warrior.slash();
		},

		onAddWarrior: function(data) {

			var warrior = new Warrior(this.$container);
			warrior.name = data.warrior.name;
			warrior.id = data.warrior.id;
			warrior.addWeapon(data.warrior.weapon);
			warrior.x = data.warrior.x;
			warrior.y = data.warrior.y;
			this.warriors[warrior.id] = warrior;
			
		},

		onRemoveWarrior: function(data) {

			var warrior = this.warriors[data.id];
			warrior.kill();

			delete this.warriors[data.id];

		},

		onDisconnect: function() {

			this.removeListeners();

		}
	}

	b.init();

	return b;
}
