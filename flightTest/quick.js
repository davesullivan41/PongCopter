var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');
var client = arDrone.createClient();
var imageIndex = 1;
var lower_threshold = [50, 0, 0];
var upper_threshold = [230, 130, 25];

var pngStream = client.getPngStream();
pngStream.on('data', function(image){
  cv.readImage(image, function(err, im){
    if(!err){
      im.save('training/raw' + imageIndex + '.jpeg');
      im.dilate(1);
      im.inRange(lower_threshold, upper_threshold);
      im.save('trainings/filtered' + imageIndex + '.jpeg');
      imageIndex = imageIndex + 1;
    }
  })
});

client.takeoff();
client
  .after(15000, function(){
    this.land()
    this.stop()
  });