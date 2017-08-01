		  //	+ "smile, innerBrowRaise, browRaise, browFurrow, noseWrinkle, 
		  //upperLipRaise, lipCornerDepressor, chinRaise, lipPucker, lipPress" //10
		  //    + "lipSuck, mouthOpen,smirk, eyeClosure, attention, 
		  //eyeWiden, cheekRaise, lidTighten, dimpler, lipStretch, jawDrop)"); //11
		  //
		  
		  /*
		  faces[0].expressions["smile"],
		  faces[0].expressions["innerBrowRaise"],
		  faces[0].expressions["browRaise"],
		  faces[0].expressions["browFurrow"],
		  faces[0].expressions["noseWrinkle"],
		  faces[0].expressions["upperLipRaise"],
		  faces[0].expressions["lipCornerDepressor"],
		  faces[0].expressions["chinRaise"],
		  faces[0].expressions["lipPucker"],
		  faces[0].expressions["lipPress"],
		  faces[0].expressions["lipSuck"],
		  faces[0].expressions["mouthOpen"],
		  faces[0].expressions["smirk"],
		  faces[0].expressions["eyeClosure"],
		  faces[0].expressions["attention"],
		  faces[0].expressions["eyeWiden"],
		  faces[0].expressions["cheekRaise"],
		  faces[0].expressions["lidTighten"],
		  faces[0].expressions["dimpler"],
		  faces[0].expressions["lipStretch"],
		  faces[0].expressions["jawDrop"]//21
          */

            //detector.detectAllExpressions();
  //detector.detectAllEmojis();
  //detector.detectAllAppearance();
  	/*
	sql = "create table if not exists emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString()  
	+ "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement";
	+ "smile, innerBrowRaise, browRaise, browFurrow, noseWrinkle, upperLipRaise, lipCornerDepressor, chinRaise, lipPucker, lipPress" //10
	+ "lipSuck, mouthOpen,smirk, eyeClosure, attention, eyeWiden, cheekRaise, lidTighten, dimpler, lipStretch, jawDrop)";
	*/
  //Draw the detected facial feature points on the image  
  function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#canvas1')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
      contxt.beginPath();
      contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
      contxt.stroke();

    }
  }

  		  /*
		  faces[0].appearance["gender"],
		  faces[0].appearance["glasses"],
		  faces[0].appearance["age"],
		  faces[0].appearance["ethnicity"], //6
          */
            
                //log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
      //  return val.toFixed ? Number(val.toFixed(0)) : val;
      // }));
      //log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
      // log('#results', "Points: " + JSON.stringify(faces[0].featurePoints, function(key, val) {
      //     return val.toFixed ? Number(val.toFixed(0)) : val;
      // }));
      
      //drawFeaturePoints(image, faces[0].featurePoints);
        
        // v.addEventListener('ended', function () {
  //   window.clearInterval(itv);
  //   //console.log("clearITV");
  //   nextVideo();
  // v.play();

  //})