var five = require('johnny-five'),
  board, button, toggle

var Raspi = require('raspi-io')
var board = new five.Board({
  io: new Raspi()
})


var Device = require('losant-mqtt').Device

// Construct device.
var device = new Device({
  id: '5a6fefc670b48a000767d586',
  key: '1cd6c6a4-1075-4ce3-b624-dce267b7edad',
  secret: 'cb7b48a5879efe38915d1eb5f7eb1f2c25d78e80f2f748e7262c4558f8503065'
})

// Connect to Losant.
device.connect()

// Listen for commands.
device.on('command', function(command) {
  console.log('Command received yo.')
  console.log(command.name)
  console.log(command.payload)

  
  //speak(command.payload.text, command.payload.voiceId ? command.payload.voiceId : null )
})

board.on('ready', function() {
	
	// Test button, used to make sure all notification are working as expected
	// Create a new `button` hardware instance. This example allows the button module to create a completely default instance
  button = new five.Button({
   pin: 'GPIO27',
   isPullup: true
  })
  
  // switch object for dry contact terminals
  toggle = new five.Switch({
   pin: 'GPIO19',
   isPullup: true
  })
  
  // Inject the `switch` hardware into
  // the Repl instance's context;
  // allows direct command line access
    board.repl.inject({
    toggle: toggle
	//button: button
  });
  
  
  
  // 'down' the test button is pressed
  button.on('down', function() {
    console.log('Test Button pressed')
    device.sendState({ button: true })
  })
 

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
 
  // Dry contact switch states
 
    toggle.on("open", function() {
//		isAlarm = true;
	wait(5000);
	console.log('dry contact good')
	device.sendState({ DryContact: false })
		
  });
    toggle.on("close", function() {
	wait(5000);
	console.log('dry contact bad')
	device.sendState({ DryContact: true })
  
	});
  
 })
