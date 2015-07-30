var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');

// create the ardrone client
// currently 640 x 360... which is ridiculously low, and could be explaining our issues
//var UdpControl = require('../node/node_modules/ar-drone/lib/control/UdpControl');
var client = arDrone.createClient();
var PaVEParser = require('../node/node_modules/ar-drone/lib/video/PaVEParser');
//var stream = new cv.ImageDataStream();

var imgCount = 0;

//var output = require('fs').createWriteStream('./vid.h264');


// image stream
var tcpStream = client.getVideoStream();

//var imgSize = 640 * 360;
//var pixelCount = 0

//var out = new cv.Matrix(360,640);

var parser = new PaVEParser();

parser
  .on('data', function(data) {
    cv.readImage(data.payload, function(err, im){
      if(!err){
        console.log("saving image");
        im.save('log/tcp' + imgCount + '.jpeg');
        imgCount = imgCount + 1;
      }
    })
  })
  .on('end', function() {
    console.log('end');
  });

tcpStream.pipe(parser);
/*
// image stream event handler
tcpStream.on('data', function(image){
  //console.log(image.length);
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
});*/

// take off and fly for 10 seconds
client.takeoff();
client
  .after(8000, function(){
    this.land()
    this.stop()
  });




/// UDP Raw stuff
/*
var fly       = true;
var emergency = true;


setInterval(function() {
  //control.ref({fly: fly, emergency: emergency});
  client.raw('CONFIG',605,'video:video_codec','80');
  client.raw('REF', (1000000000) )
  console.log("hovering");
  client.pcmd();
 client.flush();
}, 300);


var tcpStream = require('../node/node_modules/ar-drone/lib/video/TcpVideoStream');
var video = new tcpStream();
var callback = function(err) {
  if (err) {
    console.log('TcpVideoStream error: %s', err.message);
    setTimeout(function () {
      console.log('Attempting to reconnect to TcpVideoStream...');
      video.connect(callback);
    }, 1000);
  }
};

var parser = new PaVEParser();

parser
  .on('data', function(data) {
    cv.readImage(data.payload, function(err, im){
      if(!err){
        console.log("saving image");
        im.save('log/tcp' + imgCount + '.jpeg');
        imgCount = imgCount + 1;
      }
    })
  })
  .on('end', function() {
    console.log('end');
  });

video.pipe(parser);


// For the first second, disable emergency if there was one
setTimeout(function() {
  emergency = false;
}, 1000);

setTimeout(function() {
  fly = false;
}, 5000);
*/