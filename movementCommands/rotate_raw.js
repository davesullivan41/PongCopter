var arDrone = require('../node/node_modules/ar-drone');

//var UdpControl = require('../node/node_modules/ar-drone/lib/control/UdpControl');
var start   = Date.now();
var control = arDrone.createUdpControl();
var ref  = {};
var pcmd1 = {};
var pcmd2 = {};

console.log('Recovering from emergency mode if there was one ...');
ref.emergency = true;
setTimeout(function() {
  console.log('Takeoff ...');

  ref.emergency = false;
  ref.fly       = true;

}, 10);

setTimeout(function() {
  console.log('Moving...');

  // pcmd1.front = 0.5;
  // pcmd2.back = 0.5;
}, 3000);

setTimeout(function() {
  console.log('Landing ...');

  ref.fly = false;
  pcmd1 = {};
  pcmd2 = {};
}, 8000);


setInterval(function() {
  control.ref(ref);
  control.pcmd(pcmd1);
  control.flush();
  control.ref(ref);
  control.pcmd(pcmd2);
  control.flush();
}, 30);