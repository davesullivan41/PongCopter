var arDrone = require('../node/node_modules/ar-drone');
// create the ardrone client
// var client = arDrone.createClient(framerate=15); 
// create command controller
var control = arDrone.createUdpControl();
//create two command objects
var ref  = {};
var pcmd = {};

/* FUNCTION STABILIZE
causes all motion to stop and tells copter to hover
*/
function stabilize()
{
  console.log("stablized")
  pcmd = {};
}

/* FUNCTION MOVE
Parameters: 
direction - num between -1 and 1, 
with -1 being: move directly left at SPEED speed
and 1 being: move directly right at SPEED speed
and 0 being: move directly forward at SPEED speed

forward - boolean true if desired direction is angled forward, false if backward
*/
function move(delay, duration, direction, forward)//direction ranges from -1 to 1 negative is left positive is right
{
  setTimeout(function()
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
  }, delay)
  setTimeout(function() {
    pcmd = {}
  }, delay + duration)

}

/* FUNCTION commmitMotionDuration
This allows the motion to continue for duration before cancelling the movement
*/
function commitMotionDuration(duration)//duration in milliseconds
{
  setTimeout(function(){
    console.log("motion stopped")
    pcmd = {};
  }, duration);
}

/* FUNCTION moveInASquare
moves in a square - pretty straightforward
*/
function moveInASquare()
{
  var c = 0;
  var squareCoordinates = new Array([1,true],[0,false],[-1,false],[0,true]);
  var duration = 500
  var startDelay = 1000
  var nextMotionDelay = 500
  setTimeout(function() {
   setInterval(function() {
     if(c < 4)
     {
       console.log("new direction")
       var coordinates = squareCoordinates[c];

       move(coordinates[0],coordinates[1]);
       commitMotionDuration(duration) //ms

       c++;
     }
      
   }, duration + nextMotionDelay);
   //move(1,true)
  }, startDelay);
}


// client.on('navdata', function(contents) {
//   logAltitude(contents)
// })

/*
logs altitude
*/
function logAltitude(contents)
{
  data = JSON.parse(contents)
  console.log(data.demo.altitude)
  //var stuff = contents[0]
}

/* FUNCTION rotateRise

This function will hopefully make the drone rotate and rise at the same time will hovering as best as possible over
the same point.

*/
function rotateRiseAuto(delay)
{
  client.clockwise(0.5)
}

function droneUp(delay, duration)
{
  setTimeout(function() {
    pcmd.up = 0.3
  }, delay)
  setTimeout(function() {
    pcmd = {}
  }, delay + duration)
  
}

function droneDown(delay, duration)
{
  setTimeout(function() {
    pcmd.up = -0.3
  }, delay)
  setTimeout(function() {
    pcmd = {}
  }, delay + duration)
  
}

function rotate90degress(delay, direction)
{
  var time0fRotate = 800 //play with this to guage rotation speed.
  setTimeout(function() {
    pcmd.up = 0.1
    pcmd.clockwise = (direction == 'right') ? 1.0 : -1.0
  }, delay)
  setTimeout(function() {
    pcmd = {}
  }, delay + time0fRotate)
}

/* FUNCTION land
stabilizes the drone and then lands it
*/
function land(delay)
{
  setTimeout(function() {
    stabilize()
    setTimeout(function(){
      ref.fly = false;
      pcmd = {};
      console.log('Landing ...');
    }, 1000);
  }, delay);

}

//clear drone and have it take off
function fly()
{
  ref.fly = true
  ref.emergency = false
  control.ref(ref)
  control.pcmd(pcmd)
  control.flush()
  console.log("Taking off.")
}

function flyAuto()
{
  client.takeoff()
  console.log("Taking off.")
}
function landAuto(delay)
{
  setTimeout(function() {
    stabilize()
    setTimeout(function(){
      client.land()
      console.log("Landing ...")
    }, 1000);
  }, delay);
  
}

//Do Drone commands with functions here!!
var SPEED = 0.3

var totalTime = 0;

// flyAuto()
fly()
var flyDuration = 5000
totalTime += flyDuration

var moveFrontDuration = 2000
move(totalTime,moveFrontDuration,0,1)

rotate90degress(totalTime, "left")
var rotateDuration = 3000
totalTime += rotateDuration

var riseDuration = 2000
droneUp(totalTime, riseDuration)
totalTime += riseDuration

var downDuration = 2000
droneDown(totalTime, downDuration)
totalTime += downDuration

rotate90degress(totalTime, "right")
totalTime += rotateDuration

// landAuto(totalTime)
land(totalTime)

//sends commands after 30 ms to drone.
setInterval(function() {
  control.ref(ref);
  control.pcmd(pcmd);
  control.flush();
}, 30);


