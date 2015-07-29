var arDrone = require('../node/node_modules/ar-drone');

// create the ardrone client
var client = arDrone.createClient(framerate=15); 
// currently 640 x 480... which is ridiculously low, and could be explaining our issues

function performFlick()//can I define this to be called on client?
{

	client.front(1.0)
	client.back(1.0)
}


// take off and fly for 20 seconds
client.takeoff();
client
  .after(5000, function(){
  	this.front(1.0)
  })
  .after(1000, function(){
  	this.back(1.0);
  })
  .after(1000, function(){
    this.land()
    this.stop()
  });