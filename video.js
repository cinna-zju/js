var detector = null;
var db = openDatabase('myDB', '1.0', 'xx', 100 * 1024 * 1024);
// some videos are in avi format and some are in mp4
// they are in different folder in AROSTITAN
// add the first session ID of each subject 
var avi_fol = [2, 132, 392, 522, 782, 912, 1042, 1172];//8
var mp4_fol = [262, 652, 1302, 1432, 1562,
 1692, 1822, 1952, 2082, 2212,
 2342, 2472, 2602, 2732, 2862,
 2992, 3122, 3382, 3512, 3642,
  3772]; //21  
// modify to choose which video to use
var folder = mp4_fol;
// some count parameters used in loop
var no = 1;
var cnt = 0;
var fcnt = 0;
var tcnt = 0;
var itv;
var startTimestamp;

// create database
db.transaction(function (tx) {
	sql = "create table if not exists emotions" + (folder[fcnt]+cnt).toString() + '_' + no.toString()  
	+ "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement)"
	
	console.log(sql);
	tx.executeSql(sql); //11
});

$(document).ready(function () {

  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
  detector = new affdex.FrameDetector(faceMode);

  v = document.getElementById("video1");
  detector.detectAllEmotions();

  log("#logs", "starting now...");
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
      // uncomment if only process the first 11s of each video
      // block 1

      // if (v.currentTime > 11) {
      //   window.clearInterval(itv)
      //   nextVideo();
      //   v.play();
      // }
	  
    }, 100);// set caputre interval = 100 ms
    
  }, false);
  // if uncomment block 1
  // comment this
  v.addEventListener('ended', function () {
    window.clearInterval(itv);
    nextVideo();
    v.play();
  })
  
  detector.addEventListener("onInitializeSuccess", function () {
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
      log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function (key, val) {
        return val.toFixed ? Number(val.toFixed(0)) : val;
      }));
      db.transaction(function (tx) {
        tx.executeSql("insert into emotions" + (folder[fcnt] + cnt).toString() + '_' + no.toString() + " values(?,?,?,?,?,?,?,?,?,?,?)", [
          v.currentTime.toFixed(2),
          1,
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
        tx.executeSql("insert into emotions" + (folder[fcnt] + cnt).toString() + '_' + no.toString() + " values(?,0,0,0,0,0,0,0,0,0,0)", [v.currentTime]);
      });
    }
  });
  function nextVideo() {
    no += 1;
    if (no >= 5) {
      cnt += 2;
      no = 1;
    }
    if (cnt >= 40) {
      fcnt += 1;
      cnt = 0;
    }
  
    sql = "create table if not exists emotions" + (folder[fcnt] + cnt).toString() + '_' + no.toString()
      + "(time unique, nums, joy, sadness, disgust, contempt, anger, fear, surprise, valence, engagement)"
  
    db.transaction(function (tx) {
      tx.executeSql(sql);
    });

    $("#video1").attr("src", "./hci-mp4/" + (folder[fcnt] + cnt).toString() + "/BW" + no.toString() + ".avi.mp4");
    v.playbackRate = 5; // 5x faster
    $('#logs').html("");
    $("#logs").append("<span>" + v.src + "</span><br />");

  };
});  

function log(node_name, msg) {
   $(node_name).append("<span>" + msg + "</span><br />") 
}

function stopnow(){
	detector.stop();
	
}


		

		
		
		

	
	
	




