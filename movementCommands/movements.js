// load('clear.js')

var SPEED = 0.5
var arDrone = require('../node/node_modules/ar-drone');

var UdpControl = require('../node/node_modules/ar-drone/lib/control/UdpControl');

var control   = arDrone.createUdpControl();
var pcmd = {}
var ref = {}

//clear drone of emergency and other commands
client.takeoff();
client
  .after(1, function(){
    this.land()
    this.stop()
  });

console.log("cleared")

/*
Parameters: 
direction - num between -1 and 1, 
with -1 being: move directly left at SPEED speed
and 1 being: move directly right at SPEED speed
and 0 being: move directly forward at SPEED speed

forward - boolean true if desired direction is angled forward, false if backward

*/
function move(direction, forward)//direction ranges from -1 to 1 negative is left positive is right
{
	//console.log("moving to " + direction)
	direction *= -1
	direction += 1
	var angle = direction * (Math.PI / 2.0)
	//console.log(angle)
	var sideSpeed = Math.cos(angle)
	var frontSpeed = Math.sin(angle)

	frontSpeed *= (forward) ? 1:-1
	sideSpeed = (sideSpeed > .000001 || sideSpeed < -.0000001) ? sideSpeed : 0
	frontSpeed = (frontSpeed > .000001 || frontSpeed < -.0000001) ? frontSpeed : 0


	console.log(sideSpeed, frontSpeed)

	pcmd.right = sideSpeed * SPEED;
	pcmd.front = frontSpeed * SPEED;

}

//don't know if this works properly for between movements, but will work when called before landing
function stopit()
{
	
	pcmd = {};
	setTimeout(function(){
    console.log("paused")
	}, 500);

}

//initializes real take off after .1 s
setTimeout(function() {
  console.log('Takeoff ...');

  ref.emergency = false;
  ref.fly       = true;

}, 100);

//moves in a square
var c = 0;
var squareCoordinates = new Array([1,true],[0,false],[-1,false],[0,true]);
setTimeout(function() {
	setInterval(function() {
		if(c < 4){
			stopit()
			var coordinates = squareCoordinates[c];

			move(coordinates[0],coordinates[1]);


			c++;
		}
		
	}, 1000)
	//move(1,true)
}, 3000);

//make hover after 8 seconds
setTimeout(function() {

	stopit()

}, 8000);

//land
setTimeout(function() {
  console.log('Landing ...');

  ref.fly = false;
}, 8500);


//This makes whatever commands are changed take effect within the next 50 ms
setInterval(function() {
  control.ref(ref);
  control.pcmd(pcmd);
  control.flush();
  
}, 50);