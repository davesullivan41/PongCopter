var arDrone = require('../node/node_modules/ar-drone');
var cv = require('../node/node_modules/opencv');

// create the ardrone client
var client = arDrone.createClient(framerate=30); 
// currently 640 x 480... which is ridiculously low, and could be explaining our issues

var imgCount = 0;

// hsv color window
var lower_hsv = [10, 150, 150]
var upper_hsv = [25, 255, 255]

var lastPng;
var processingImage = false;

function updateDroneAction(coords)
{
  if(coords[0][0] == -1)
  {
    console.log("I DONT SEE IT")
    client.stop();
  }
  else if(coords[0][0] > 330)
  {
    console.log("I see the ball to the right")
    //client.right(0.5*(coords[0][0]-320.0)/320.0);
   client.right(0.2);
        client.after(50,function(){
        client.left(0.2);
      });
  }
  else if(coords[0][0] < 310)
  {
    console.log("I see the ball to the left")
    client.left(0.2);
    //client.left(0.5*coords[0][0]/320.0);
      client.after(50,function(){
       client.right(0.2);
      });
  }
  else
  {
    console.log("I DONT SEE IT")
    client.stop();
  }
  processingImage = false;
}

function processImage(){
  if( (! processingImage ) && lastPng){
    processingImage = true;
    cv.readImage(lastPng, function(err, im){
      if(!err){
        // optionally save the raw images
        //im.save('log/raw' + imgCount + '.jpeg');

        // convert to hsv and filter out the ball
        im.convertHSVscale();
        im.inRange(lower_hsv, upper_hsv);
        im.dilate(3);
        

        // find the contours
        contours = im.findContours();
        
        // store up to the first 5 coordinates in an array
        coordinates = new Array(5);
        for(var i=0;i<5;i++)
        {
          if(i >= contours.size())
          {
            coordinates[i] = [-1,-1,-1];
          }
          else
          {
            coordinates[i] = [contours.boundingRect(i).x,contours.boundingRect(i).y,contours.area(i)];
          }
        }
        //var end = new Date().getTime();
        //console.log(end - start);
        // pass the array and the drone controller to a separate function
        updateDroneAction(coordinates);

        // optionally save the current image
        //im.save('log/proc' + imgCount + '.jpeg');
        //imgCount = imgCount + 1;
      }
    })
  }
}

// image stream
var pngStream = client.getPngStream();

// image stream event handler
pngStream.on('data', function(image){
  //var start = new Date().getTime();
  // pass the image to opencv
  lastPng = image;
});

var detectBall = setInterval(processImage,20);

// take off and fly for 2 minutes
client.takeoff();
client
  .after(20000, function(){
    this.land()
    this.stop()
  });