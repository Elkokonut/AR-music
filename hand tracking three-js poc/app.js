import { type } from 'os';
import createScene from './ar.js';
import * as tf from '@tensorflow/tfjs';

async function main() {

  var video = document.querySelector('video')

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;


        video.addEventListener('canplay', async function (ev) {
          if (!streaming) {
            // requestAnimationFrame(render);
            while(true)
            {
              await render();
              await tf.nextFrame();
            }
          }
        }, false);
      })
      .catch(function (error) {
        console.log("Something went wrong!");
      });
  
  render = await createScene(video);
  video.style.display = "none"
  streaming = false;
  }
  else {
    console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
  }

};

main();