import createScene from './ar.js';

async function main() {

  var video = document.querySelector('video')

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        video.style.cssText = "-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;";
        video.style.display = "none";
        var streaming = false;
        video.addEventListener('playing', async function () {
          if (!streaming) {
            streaming = true;
            var render = await createScene(video);
            requestAnimationFrame(render);
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