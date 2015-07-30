var SPEED = 0.5
var arDrone = require('../node/node_modules/ar-drone');
var client = arDrone.createClient(framerate=30); 

var UdpControl = require('../node/node_modules/ar-drone/lib/control/UdpControl');

var control   = arDrone.createUdpControl();
var pcmd = {}
var ref = {}

// //clear drone of emergency and other commands
// client.takeoff();
// client
//   .after(2000, function(){
//     this.land()
//   });
// console.log("cleared")

client.on('navdata', function(contents) {
	logAltitude(contents)
})
client.on('navdata', getAltitudeData)

function logAltitude(contents)
{	data = JSON.parse(contents)
	console.log(data.demo.altitude)
	//var stuff = contents[0]
	//console.log(stuff)
}
//Define functions here
function getAltitudeData()
{

}

function stopit()
{
	pcmd = {};
}


//initializes real take off after .1 s
setTimeout(function() {
  console.log('Takeoff ...');

  ref.emergency = false;
  ref.fly       = true;

}, 100);

//try to get it to fly at a parameter based altitude.



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