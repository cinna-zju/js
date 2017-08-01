var detector = null;
var db = openDatabase('myDB', '1.0', 'xx', 100 * 1024 * 1024);

var avi_fol = [2, 132, 392, 522, 782, 912, 1042, 1172];//8
var mp4_fol = [262, 652, 1302, 1432, 1562,
 1692, 1822, 1952, 2082, 2212,
 2342, 2472, 2602, 2732, 2862,
 2992, 3122, 3382, 3512, 3642,
  3772]; //21
var folder = avi_fol;
var no = 1;
var cnt = 0;
var fcnt = 0;
var tcnt = 0;
var itv;
var startTimestamp;

db.transaction(function (tx) {
	/*
	sql = "create table if not exists emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString()  
	+ "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement";
	+ "smile, innerBrowRaise, browRaise, browFurrow, noseWrinkle, upperLipRaise, lipCornerDepressor, chinRaise, lipPucker, lipPress" //10
	+ "lipSuck, mouthOpen,smirk, eyeClosure, attention, eyeWiden, cheekRaise, lidTighten, dimpler, lipStretch, jawDrop)";
	*/
	
	sql = "create table if not exists emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString()  
	+ "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement)"
	
	console.log(sql);
	tx.executeSql(sql); //11
});


$(document).ready(function(){

  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
  // var faceMode = affdex.FaceDetectorMode.SMALL_FACES;
  detector = new affdex.FrameDetector(faceMode);

  v = document.getElementById("video1");    
  //Enable detection of all Expressions, Emotions and Emojis classifiers.
  detector.detectAllEmotions();


  log("#logs","starting now...");
  detector.start();

  v.addEventListener('play', function () {
    detector.reset();
    startTimestamp = (new Date()).getTime() / 1000;
    
    itv = window.setInterval(function () {
      var aCanvas = document.getElementById('canvas1');
      var context = aCanvas.getContext('2d');
      var imageData = context.getImageData(0, 0, 480, 320);
      var now = (new Date()).getTime() / 1000;
      var deltaTime = now - startTimestamp;
      if (detector && detector.isRunning) {
        detector.process(imageData, deltaTime);
      }
      if (v.currentTime > 15) {
        window.clearInterval(itv)
        nextVideo();
        v.play();
      }
	  
    }, 250);
    
  }, false);
  
  // v.addEventListener('ended', function () {
  //   window.clearInterval(itv);
  //   //console.log("clearITV");
  //   nextVideo();
	// v.play();

  })

  //Add a callback to notify when the detector is initialized and ready for runing.
  detector.addEventListener("onInitializeSuccess", function() {
    log("#logs", "started");
    v.play();
  });

  detector.addEventListener("onInitializeFailure", function () {
    log("#logs", "init failed, restarting now...");
  });

  detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
	
    $('#results').html("");
    log('#results', "Timestamp: " + v.currentTime.toFixed(2));
    log('#results', "Number of faces found: " + faces.length);
    if (faces.length > 0) {
      // log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
      log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
        return val.toFixed ? Number(val.toFixed(0)) : val;
      }));
      //log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
      //  return val.toFixed ? Number(val.toFixed(0)) : val;
      // }));
      //log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
      // log('#results', "Points: " + JSON.stringify(faces[0].featurePoints, function(key, val) {
      //     return val.toFixed ? Number(val.toFixed(0)) : val;
      // }));
      
	  //drawFeaturePoints(image, faces[0].featurePoints);
      


      db.transaction(function (tx) {
		  //console.log("insert");
        tx.executeSql("insert into emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString() + " values(?,?,?,?,?,?,?,?,?,?,?)", [
          v.currentTime.toFixed(2),
          1,
		  /*
		  faces[0].appearance["gender"],
		  faces[0].appearance["glasses"],
		  faces[0].appearance["age"],
		  faces[0].appearance["ethnicity"], //6
		  */
          faces[0].emotions["joy"].toFixed(0),
          faces[0].emotions["sadness"].toFixed(0),
          faces[0].emotions["disgust"].toFixed(0),
          faces[0].emotions["contempt"].toFixed(0),
          faces[0].emotions["anger"].toFixed(0),
          faces[0].emotions["fear"].toFixed(0),
          faces[0].emotions["surprise"].toFixed(0),
          faces[0].emotions["valence"].toFixed(0),
          faces[0].emotions["engagement"].toFixed(0), //9

		  
        ]
        )
      });
      

    } else {
      db.transaction(function (tx) {
        tx.executeSql("insert into emotions"+(folder[fcnt]+cnt).toString()+'_'+no.toString()+" values(?,0,0,0,0,0,0,0,0,0,0)", [v.currentTime]);
      });
    }
  });

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

function nextVideo() {	
  no += 1;
  if(no >= 5){
    cnt += 1;
    no = 1;
  }
  if( cnt >= 40){
    fcnt += 1;
    cnt = 0;
  }
  
  sql = "create table if not exists emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString()  
  + "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement)"
  
  db.transaction(function (tx) {
      tx.executeSql(sql); 
    });

  $("#video1").attr("src", "./hci-avi/"+(folder[fcnt]+ cnt).toString()+"/BW"+no.toString()+".avi");
  v.playbackRate = 2;
  $('#logs').html("");
  $("#logs").append("<span>" + v.src +"</span><br />");
  
};

function log(node_name, msg) {
   $(node_name).append("<span>" + msg + "</span><br />") 
}

function stopnow(){
	detector.stop();
	
}


		

		
		
		

	
	
	




