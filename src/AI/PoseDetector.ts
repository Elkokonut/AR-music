// Register WebGL backend.
import * as pipe_holistic from '@mediapipe/holistic'
import * as pipe_camera from '@mediapipe/camera_utils'
import * as tf from '@tensorflow/tfjs';


export default class PoseDetector {
  video: HTMLVideoElement;
  model: pipe_holistic.Holistic;
  static pred_buffer: Array<number>;


  constructor(video) {
    PoseDetector.pred_buffer = []
    this.video = video;
    this.model = new pipe_holistic.Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }
    });
  }

  private static changeInstrument(scene, pred) {
    const pred_instrument = pred.indexOf(Math.max(...pred))
    PoseDetector.pred_buffer.unshift(...[pred_instrument])
    if (PoseDetector.pred_buffer.length == 6)
      PoseDetector.pred_buffer.pop()
    if (PoseDetector.pred_buffer.filter((n) => n == pred_instrument).length == 5) {
      switch (pred_instrument) {
        case 0:
          scene.factory.change_instrument("drums", scene);
          break;
        case 1:
          scene.factory.change_instrument("microphone", scene);
          break;
        default:
          break;
      }
    }
  }

  async init(scene) {
    console.log("INIT AI");
    let sendCounter = 0;
    const pose_model = await tf.loadLayersModel('pose_ml_model/model.json');
    const camera = new pipe_camera.Camera(
      this.video,
      {
        onFrame: async () => {
          if (sendCounter == 1) globalThis.APPNamespace.App.ui.hideLoading();
          await this.model.send({ image: this.video });
          sendCounter++;
        },
        width: this.video.videoWidth,
        height: this.video.videoHeight
      }
    );

    this.model.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.3,
      minTrackingConfidence: 0.3
    });

    async function onResults(results) {
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
    }

    this.model.onResults(onResults);
    camera.start();
  }
}
