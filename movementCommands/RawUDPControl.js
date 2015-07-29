// Run this to make your drone take off for 5 seconds and then land itself
// again.

var UdpControl = require('../node/node_modules/ar-drone/lib/control/UdpControl');

var control   = new UdpControl();
var fly       = true;
var emergency = true;

setInterval(function() {
  //control.ref({fly: fly, emergency: emergency});
  control.raw('REF', (1<<9) )
  console.log("hovering");
  control.pcmd();
 control.flush();
}, 300);

/*
setInterval(function() {
  control.ref({fly: fly, emergency: emergency});
  console.log("going up");
  control.pcmd({
  front: 0.1, // fly forward with 20% speed
  up: 0.6, // and also fly up with 50% speed
});
 control.flush();
}, 1000);

setInterval(function() {
  control.ref({fly: fly, emergency: emergency});
  console.log("going down");
  control.pcmd({
  front: 0.4, // fly forward with 20% speed
  up: -1.0, // and also fly up with 50% speed
});
 control.flush();
}, 1000);
*/

// For the first second, disable emergency if there was one
setTimeout(function() {
  emergency = false;
}, 1000);

setTimeout(function() {
  fly = false;
}, 5000);