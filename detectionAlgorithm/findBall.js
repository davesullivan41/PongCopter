var cv = require('../node/node_modules/opencv/lib/opencv');

// (B)lue, (G)reen, (R)ed
// 250, 120, 195
var lower_threshold = [50, 0, 0];
var upper_threshold = [230, 130, 25];
var minArea = 2000;
var WHITE = [255, 255, 255]; // B, G, R

for(j = 0 ; j < 5 ; j++){
	cv.readImage('./files/' + j.toString() + '.jpg', function(err, im) {
	  if (err) throw err;
	  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
	  im.inRange(lower_threshold, upper_threshold);

	  var out = new cv.Matrix(im.height(), im.width());
	  im.dilate(8);

	  contours = im.findContours();

	  for (i = 0; i < contours.size(); i++) {

	    if (contours.area(i) < minArea) continue;

	    var arcLength = contours.arcLength(i, true);
	    //contours.approxPolyDP(i, 0.01 * arcLength, true);
	    out.drawContour(contours, i, WHITE);
	   }

	  out.save('./out/' + j.toString() + '.jpg');
	});
}