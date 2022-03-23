import BodyTrackerScene from './ar.js';
import poseDetector from './ia.js';
import enableInlineVideo from 'iphone-inline-video';

var webcam = true;
var video = document.querySelector('#webcam');
if (!video) {
  video = document.querySelector('#fancam');
  webcam = false;
  require("url:./fancam.mp4");
}

enableInlineVideo(video);

video.style.display = "none";

if (webcam) {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
      })
      .catch(function (error) {
        console.log("Something went wrong!", error);
      });
  }
  else {
    console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
  }
}
var initialisation = false;


video.addEventListener('canplay', async function () {
  console.log("canplay fired");
  if (!initialisation) {
    initialisation = true;
    await initPage();
  }
  video.play();
});

video.addEventListener('playing', async function () {
  console.log("playing fired");
  if (!initialisation) {
    initialisation = true;
    await initPage();
  }
});

video.addEventListener('pause', async function () {
  console.log("pause fired");
  if (!initialisation) {
    initialisation = true;
    await initPage();
  }
  video.play();
});


async function initPage() {
  var scene = new BodyTrackerScene(video);
  await scene.init();
  var promise = video.play();
  if (promise !== undefined) {
    promise.catch(error => {
      console.log("Create Button: " + error);
      // Auto-play was prevented
      // Show a UI element to let the user manually start playback
      createButton();
    }).then(() => {
      // Auto-play started
      console.log("Autoplay!");
    });
  }

  document.querySelector('canvas').style = 'width: 100%; \
                                          max-width: 100%; \
                                          height: 100%;';

  if (webcam) {
    document.querySelector('canvas').style = ' -moz-transform: scale(-1, 1); \
                                          -webkit-transform: scale(-1, 1); \
                                          -o-transform: scale(-1, 1); \
                                          transform: scale(-1, 1); \
                                          filter: FlipH; \
                                          width: 100%; \
                                          max-width: 100%; \
                                          height: 100%;'
  }
  var pose_detector = new poseDetector(video);
  await pose_detector.init();

  await pose_detector.mainLoop(scene);
}

video.addEventListener('loadeddata', (event) => {
  console.log('loadeddata');
});

function createButton() {
  let btn = document.createElement("button");
  document.querySelector('canvas').style.display = "none";
  btn.innerHTML = "Start";
  document.body.appendChild(btn);
  btn.addEventListener('click', function () {
    video.play();
    document.querySelector('canvas').style.display = null;
    btn.style.display = "none";
  });
}
