var cv = require('../node/node_modules/opencv/lib/opencv');



// hsv color window
var lower_hsv = [10, 150, 150];
var upper_hsv = [25, 255, 255];

var start = new Date().getTime();

cv.readImage('raw33.jpeg', function(err,im){
	if(err) throw err;

	im.convertHSVscale();
	im.inRange(lower_hsv, upper_hsv);
	// find the contours
	contours = im.findContours();
	var out = new cv.Matrix(im.height(), im.width());
	out.drawContour(contours,0,[255,255,255]);
	out.drawContour(contours,1,[255,255,255]);
	// optionally save the current image
	im.save('curr.jpeg');
	out.save('out.jpeg');

});

/*
// (B)lue, (G)reen, (R)ed
// 250, 120, 195
var lower_threshold = [30, 130, 190];
var upper_threshold = [100, 205, 255];
var lower_hsv = [10, 150, 150]
var upper_hsv = [25, 255, 255]
var minArea = 200;
var WHITE = [255, 255, 255]; // B, G, R

for(j = 1 ; j < 221 ; j++){
	cv.readImage('../flightTest/RobBounce/raw' + j.toString() + '.jpeg', function(err, im) {
	  if (err) throw err;
	  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
	  //im.dilate(2);
	  var hsv = new cv.Matrix(im.height(), im.width());
	  hsv = im.copy();
	  hsv.convertHSVscale();
	  hsv.inRange(lower_hsv, upper_hsv);

	  var out = new cv.Matrix(im.height(), im.width());

	  hsv.dilate(2);

	  contours = hsv.findContours();

	  for (i = 0; i < contours.size(); i++) {

	    if (contours.area(i) < minArea) continue;
	   	//console.log("x: " + contours.boundingRect(i).x + " y: " + contours.boundingRect(i).y);
	    //var arcLength = contours.arcLength(i, true);
	    //contours.approxPolyDP(i, 0.01 * arcLength, true);
	    out.drawContour(contours, i, WHITE);
	   }
	  console.log(j + " complete");

	  out.save('./out/hsv' + j.toString() + '.jpeg');
	});
}
*/