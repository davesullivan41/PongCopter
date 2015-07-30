var arDrone = require('../node/node_modules/ar-drone');

// create the ardrone client
var client = arDrone.createClient(framerate=15); 
// currently 640 x 480... which is ridiculously low, and could be explaining our issues

// take off and fly for 20 seconds
client.takeoff();
client
  .after(1000, function(){
    this.land()
    this.stop()
  });

console.log("cleared")
