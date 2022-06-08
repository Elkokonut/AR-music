// Register WebGL backend.
import * as pipe_hands from '@mediapipe/hands'
import * as pipe_camera from '@mediapipe/camera_utils'

export default class PoseDetector {
  video: HTMLVideoElement;
  model: pipe_hands.Hands;
  static pred_buffer: Array<number>;


  constructor(video) {
    PoseDetector.pred_buffer = []
    this.video = video;
    this.model = new pipe_hands.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

  }


  async init(scene) {
    console.log("INIT AI");
    let sendCounter = 0;
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
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    async function onResults(results) {
      const left = results.multiHandLandmarks[0];
      const right = results.multiHandLandmarks[1];

      if ((left && left.length > 0)
        || (right && right.length > 0)) {
        const keypoints =
        {
          "left_hand": left,
          "right_hand": right
        };
        scene.update_keypoints(keypoints);
      }
    }

    this.model.onResults(onResults);
    camera.start();
  }
}
