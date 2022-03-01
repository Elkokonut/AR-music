navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

var video = document.querySelector('video')
streaming = false;

scene = new Scene(video)


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

          scene.add(new Cube())

          camera.aspect = video.videoWidth / video.videoHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(video.videoWidth, video.videoHeight);

          streaming = true;

          console.log("adding cube")
          const geometry = new THREE.BoxGeometry();
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          const cube = new THREE.Mesh(geometry, material);
          scene.add(cube);

          camera.position.z = 5;


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