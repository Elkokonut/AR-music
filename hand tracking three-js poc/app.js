import createScene from './ar.js';

async function main() {

  var video = document.querySelector('video')
  var streaming = false;

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        video.style.display = "none";
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