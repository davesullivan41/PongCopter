var arDrone = require('../node/node_modules/ar-drone');

// create the ardrone client
var client = arDrone.createClient(framerate=15); 
// currently 640 x 480... which is ridiculously low, and could be explaining our issues

function performFlick()//can I define this to be called on client?
{

	client.forward(0.2)
	client.back(0.2)
}


// take off and fly for 20 seconds
client.takeoff();
client
  .after(8000, function(){
  	this.forward(.1)
  	this.backward(.1)
    this.land()
    this.stop()
  });