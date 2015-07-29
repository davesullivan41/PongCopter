var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');

// create the ardrone client
var client = arDrone.createUdpControl();//framerate=15); 
// currently 640 x 360... which is ridiculously low, and could be explaining our issues

var PaVEParser = require('../node/node_modules/ar-drone/lib/video/PaVEParser');
//var stream = new cv.ImageDataStream();

var imgCount = 0;

//var output = require('fs').createWriteStream('./vid.h264');

var video = client.getVideoStream();
var parser = new PaVEParser();

/*
stream.on('frame', function(matrix){
  console.log('frame');
  console.log(matrix.length);

});*/

parser
  .on('data', function(data) {
   cv.readImage(matrix, function(err, im){
    if(!err){
      console.log("saving image");
      im.save('log/tcp' + imgCount + '.jpeg');
      imgCount = imgCount + 1;
    }
  })
  })
  .on('end', function() {
    console.log('end');
    s.end();
  });


video.pipe(parser);



/*

// image stream
var tcpStream = client.getVideoStream();

var imgSize = 640 * 360;
var pixelCount = 0

var out = new cv.Matrix(360,640);

// image stream event handler
tcpStream.on('data', function(image){
  console.log(image.length);
  //var mat = new cv.Matrix()
  //console.log(640*360);
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
// take off and fly for 10 seconds
client.takeoff();
client
  .after(6000, function(){
    this.land()
    this.stop()
  });