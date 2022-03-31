// Register WebGL backend.
import * as pipe_holistic from '@mediapipe/holistic'
import * as pipe_camera from '@mediapipe/camera_utils'

export default class poseDetector {
    constructor(video) {
        this.video = video;
        this.model = new pipe_holistic.Holistic({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
          }});
        this.detector;
    }

    async init(scene) {
        console.log("INIT SCENE");
        console.log( this.video.videoWidth);
        console.log( this.video.videoHeight);
        const camera = new pipe_camera.Camera(this.video, {
            onFrame: async () => {
              await this.model.send({image: this.video});
            },
            width: this.video.videoWidth,
            height: this.video.videoHeight
          });
        this.model.setOptions({
            modelComplexity: 0,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            refineFaceLandmarks: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          var nb_calls = 0;
          setInterval(() => {
              document.getElementById("frameRateAI").innerHTML = 'AI FrameRate: ' + nb_calls;
              nb_calls = 0;
          }
              , 1000);
          function onResults(results)
          {
            var keypoints = [];
            keypoints = keypoints.concat(results.poseLandmarks, results.leftHandLandmarks, results.rightHandLandmarks);
            if (keypoints.length > 0){
                scene.move_objects(keypoints);
            }
            nb_calls++;
          }
          this.model.onResults(onResults);
          camera.start();
    }
}

