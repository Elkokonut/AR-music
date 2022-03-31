import * as THREE from 'three';
import oc from 'three-orbit-controls';

var video = document.querySelector('video')
var streaming = false;

const OrbitControls = oc(THREE)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

video.style.display = 'none';
var videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture

const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
const axesHelper = new THREE.AxesHelper(1000);


var controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 1000;

controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
const cube = new THREE.Mesh(geometry, material);

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(async function (localMediaStream) {
    //
    // Called on success
    //
      video.setAttribute('autoplay', 'autoplay');
      video.srcObject = localMediaStream;

      video.addEventListener('canplay', function () {
        if (!streaming) {

          camera.aspect = video.videoWidth / video.videoHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(video.videoWidth, video.videoHeight);

          streaming = true;

          console.log("adding cube")

          scene.add(cube);
          scene.add(axesHelper);
          scene.add(gridHelper);

          camera.position.z = 5;

          video.play();
          document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); \
                                                    -webkit-transform: scale(-1, 1); \
                                                    -o-transform: scale(-1, 1); \
                                                    transform: scale(-1, 1); \
                                                    filter: FlipH;\
                                                    width: 100%; \
                                                    max-width: 100%; \
                                                    height: 100%;';

          requestAnimationFrame(render);
        }
      }, false);
    }
  ).catch(function (error) {
    console.log("Something went wrong!", error);
  });
}
else {
  console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
}


function render() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z -= 0.01;
  controls.update();
  renderer.render(scene, camera);
}