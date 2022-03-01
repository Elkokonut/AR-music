import { type } from 'os';
import createScene from './ar.js';


async function main() {
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  var video = document.querySelector('video')
  video.style.display = "none"
  streaming = false;


  render = await createScene(video);


  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
        video: true,
        audio: false
      },

      //
      // Fonction appelée en cas de réussite
      //
      function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;

        video.addEventListener('canplay', function (ev) {
          if (!streaming) {

            requestAnimationFrame(render);
          }
        }, false);
      },

      //
      // Fonction appelée en cas d'échec
      //
      function (err) {
        console.log("Une erreur est survenue: " + err);
      }
    );
  }
  else {
    console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
  }

};

main();