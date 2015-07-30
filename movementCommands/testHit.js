var arDrone = require('../node/node_modules/ar-drone');
var control = arDrone.createUdpControl();

// create the ardrone client
var client = arDrone.createClient(framerate=15); 
// currently 640 x 480... which is ridiculously low, and could be explaining our issues

var ref  = {};
var pcmd1 = {};
ref.emergency = true;

function performFlick()//can I define this to be called on client?
{ 
  udpControl.raw('REF', (1 << 9));
}


setTimeout(function() {
  console.log('Takeoff ...');

  ref.emergency = false;
  ref.fly       = true;
  control.ref(ref);
  control.flush();
}, 10);

// take off and fly for 20 seconds
//client.takeoff();
client
  .after(4000, function(){
    control.ref(ref);
    control.pcmd({front:1.0});
    control.flush();

  })
  .after(500, function(){
    control.ref(ref);
  	control.pcmd({front:-1.0});
    control.flush();

  })
  .after(2000, function(){
    this.land()
    this.stop()
  });