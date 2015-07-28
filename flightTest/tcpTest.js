var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');

// create the ardrone client
var client = arDrone.createClient(framerate=15); 
// currently 640 x 360... which is ridiculously low, and could be explaining our issues

var imgCount = 0;

// image stream
var tcpStream = client.getVideoStream();

var s = new cv.ImageDataStream();

s.on('load', function(matrix){
  console.log('loaded');
  matrix.save('stream.jpeg');
});



tcpStream.pipe(s);
/*
var imgSize = 640 * 360;
var pixelCount = 0

var out = new cv.Matrix(360,640);

// image stream event handler
tcpStream.on('data', function(image){
  console.log(image.length);
  console.log(640*360);
  // console.log(image.readUInt8(0));
  // console.log(image.readUInt8(1));
  // console.log(image.readUInt8(2));
  console.log('---');
  // pass the image to opencv
 cv.readImage(image, function(err, im){
    if(!err){
      im.save('log/tcp' + imgCount + '.jpeg');
      imgCount = imgCount + 1;
    }
  })
});
*/
// take off and fly for 2 minutes
client.takeoff();
client
  .after(10000, function(){
    this.land()
    this.stop()
  });