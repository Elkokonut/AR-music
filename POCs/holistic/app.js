import BodyTrackerScene from './ar.js';
import poseDetector from './ia.js';

async function main() {

  var video = document.querySelector('video');

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        video.style.display = "none";
        var streaming = false;
        video.addEventListener('canplay', async function () {
          if (!streaming) {
            streaming = true;
            var scene = new BodyTrackerScene(video);
            await scene.init();
            var pose_detector = new poseDetector(video);
            await pose_detector.init(scene);
            video.play();

          }
        }, false);
      })
      .catch(function (error) {
        console.log("Something went wrong!", error);
      });
  }
  else {
    console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
  }

}

main();