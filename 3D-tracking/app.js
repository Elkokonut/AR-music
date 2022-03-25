import BodyTrackerScene from './ar.js';

async function main() {


var video = document.querySelector('video');
video.style = 'width: 100%; max-width: 100%; height: 100%;';

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        var streaming = false;
        video.addEventListener('canplay', async function () {
          if (!streaming) {
            streaming = true;
            var scene = new BodyTrackerScene(video);
            video.style.display = "none";
            video.play();
            await scene.init();
            await scene.animate();
            video.play();

            //end of slider logic

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