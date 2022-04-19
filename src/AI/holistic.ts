// Register WebGL backend.
import * as pipe_holistic from '@mediapipe/holistic'
import * as pipe_camera from '@mediapipe/camera_utils'
import * as tf from '@tensorflow/tfjs';

export default class poseDetector {
  video: HTMLVideoElement;
  model: pipe_holistic.Holistic;
  
  constructor(video) {
    this.video = video;
    this.model = new pipe_holistic.Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }
    });
  }

  async init(scene) {
    console.log("INIT AI");
    const pose_model = await tf.loadLayersModel('pose_ml_model/model.json');
    const camera = new pipe_camera.Camera(this.video, {
      onFrame: async () => {
        await this.model.send({ image: this.video });
      }, 
      width: this.video.videoWidth,
      height: this.video.videoHeight
      // width: window.APPNamespace.width,
      // height: window.APPNamespace.height
    });
    this.model.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.3,
      minTrackingConfidence: 0.3
    });
    let nb_calls = 0;
    setInterval(() => {
      document.getElementById("frameRateAI").innerHTML = 'AI FrameRate: ' + nb_calls;
      nb_calls = 0;
    }
      , 1000);
    function onResults(results) {
      const keypoints =
      {
        "body": results.poseLandmarks,
        "left_hand": results.leftHandLandmarks,
        "right_hand": results.rightHandLandmarks
      };
      if ((results.poseLandmarks && results.poseLandmarks.length > 0)
        || (results.leftHandLandmarks && results.leftHandLandmarks.length > 0)
        || (results.rightHandLandmarks && results.rightHandLandmarks.length > 0)) {
        scene.update_keypoints(keypoints);
      }
      let poseLandmarks_to_pred = tf.tensor(results.poseLandmarks.reduce(function (array, data_point) {
        array.push(data_point.x);
        array.push(data_point.y);
        array.push(data_point.z);
        array.push(data_point.visibility);
        return array;
       }, []));
      poseLandmarks_to_pred = poseLandmarks_to_pred.expandDims(0);
      const pred = (pose_model.predict(poseLandmarks_to_pred) as tf.Tensor).dataSync();
      console.log(pred);
      nb_calls++;
    }
    this.model.onResults(onResults);
    camera.start();
  }
}
