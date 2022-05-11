// Register WebGL backend.
import * as pipe_holistic from '@mediapipe/holistic'
import * as pipe_camera from '@mediapipe/camera_utils'
import Classifier from './Classifier';

export default class PoseDetector {
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

  async init(scene, ui) {
    console.log("INIT AI");
    const classifier = new Classifier();
    let sendCounter = 0;
    const camera = new pipe_camera.Camera(
      this.video,
      {
        onFrame: async () => {
          if (sendCounter == 1) ui.hideLoading();
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

      if ((results.poseLandmarks && results.poseLandmarks.length > 0)
      && (results.leftHandLandmarks && results.leftHandLandmarks.length > 0)
      && (results.rightHandLandmarks && results.rightHandLandmarks.length > 0)) {
        if (classifier.isLearning)
        {
          classifier.addExample(results);
        }
        else
        {
          if (classifier.enabled)
          {
            //var classifier_pred = classifier.predict(results);
            // call the function that will handle the prediction. Either load new models, or play sounds.
            // handler(classifier_pred);
          }
        }
    }


    }

    this.model.onResults(onResults);
    camera.start();
  }
}
