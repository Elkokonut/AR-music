import BodyTrackerScene from './ar.js';

async function main() {

  var video = document.querySelector('video')

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async function (localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;
        video.style.display = "none";
        var streaming = false;
        video.addEventListener('playing', async function () {
          if (!streaming) {
            streaming = true;
            var scene = new BodyTrackerScene(video);
            await scene.init();
            await scene.animate();
            //sliders logic
            var mcoff_slider = document.getElementById("mincutoff_slider");
            var beta_slider = document.getElementById("beta_slider");
            mcoff_slider.oninput = function() {
              scene.objects.forEach(elm => {
                if(elm.euroFilter != null)
                  elm.euroFilter.set_mcoff(mcoff_slider.value/100);
              });
            }
            beta_slider.oninput = function() {
              scene.objects.forEach(elm => {
                if(elm.euroFilter != null)
                  elm.euroFilter.set_beta(beta_slider.value/100);
              });
            }
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