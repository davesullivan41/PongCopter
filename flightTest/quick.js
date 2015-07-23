var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');
var drive = require('./droneDrive.js');

// create the ardrone client
var client = arDrone.createClient(framerate=15);

// hsv color window
var lower_hsv = [10, 150, 150]
var upper_hsv = [25, 255, 255]

function updateDroneAction(coords)
{
  if(coords[0][0] == -1)
  {
    console.log("I DONT SEE IT")
    client.stop();
  }
  else if(coords[0][0] > 370)
  {
    console.log("I see the ball to the right")
    client.right(0.2);
        client.after(50,function(){
       this.stop()
      });
  }
  else if(coords[0][0] < 350)
  {
    console.log("I see the ball to the left")
    client.left(0.2);
        client.after(50,function(){
       this.stop();
      });
  }
  else
  {
    console.log("I DONT SEE IT")
    client.stop();
  }
}

// image stream
var pngStream = client.getPngStream();

// image stream event handler
pngStream.on('data', function(image){
  // pass the image to opencv
  cv.readImage(image, function(err, im){
    if(!err){
      // optionally save the raw images
      //im.save('log/raw' + imageIndex + '.jpeg');

      // convert to hsv and filter out the ball
      im.convertHSVscale();
      im.inRange(lower_hsv, upper_hsv);

      // optionally save the current image
      im.save('curr.jpeg');

      // find the contours
      contours = im.findContours();
      
      // store up to the first 5 coordinates in an array
      coordinates = new Array();
      for(var i=0;i<5;i++)
      {
        if(i >= contours.size())
        {
          coordinates.push([-1,-1]);
        }
        else
        {
          coordinates.push([contours.boundingRect(i).x,contours.boundingRect(i).y]);
        }
      }

      // pass the array and the drone controller to a separate function
      updateDroneAction(coordinates);
    }
  })
});

// take off and fly for 2 minutes
client.takeoff();
client
  .after(1200000, function(){
    this.land()
    this.stop()
  });