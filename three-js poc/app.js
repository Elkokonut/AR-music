navigator.getUserMedia = (
    navigator.getUserMedia        ||
    navigator.webkitGetUserMedia  ||
    navigator.mozGetUserMedia     ||
    navigator.msGetUserMedia
  );
  
var video = document.querySelector('video')
streaming = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer(canvas=video, alpha=true);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

video.style.display = 'none';
videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture


controls  = new THREE.OrbitControls(camera, renderer.domElement );

    camera.position.z = 1000;

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
         video: true,
         audio: false
      },

      //
      // Called on success
      //
      function(localMediaStream) {
        video.setAttribute('autoplay', 'autoplay');
        video.srcObject = localMediaStream;

        video.addEventListener('canplay', function(ev) {
          if (!streaming) {

            camera.aspect = video.videoWidth / video.videoHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( video.videoWidth, video.videoHeight );

            streaming = true;

            console.log("adding cube")
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );

            camera.position.z = 5;


            requestAnimationFrame(render);
          }
        }, false);
      },

      //
      // Called on Error
      //
      function(err) {
         console.log("Une erreur est survenue: " + err);
      }
    );
  }
  else {
    console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
  }


  function render() {
    requestAnimationFrame(render);
  
    controls.update();
    renderer.render(scene, camera);
  }