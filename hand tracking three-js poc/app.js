import { type } from 'os';
import createScene from './ar.js';
import * as tf from '@tensorflow/tfjs';

async function main() {

  var video = document.querySelector('video')

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        video.style.display = "none";
        streaming = false;
        video.addEventListener('playing', async function () {
          if (!streaming) {
            var streaming = true;
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

};

main();