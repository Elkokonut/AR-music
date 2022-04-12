declare function require(name: string);
const keypoint_json = require("../../../static/json/keypoints.json");
import Scene from "./Scene";
import Disk from "../objects/Disk";
import { initDistance, generateKeypoints } from "../../tools/keypoints_helper";
import Keypoint from "../../tools/Keypoint";
import Distance from "../../tools/Distance";
import BodyTrackerObject from "../objects/BodyTrackerObject"

import InstrumentFactory from "../objects/InstrumentFactory";
import Microphone from "../objects/Microphone";
import Occluser from "../objects/Occluser";

export default class BodyTrackerScene extends Scene {
  keypoints: Keypoint[];
  distances: { [key: string]: Distance };

  constructor(video, debug) {
    super(video, debug);
    this.keypoints = generateKeypoints(keypoint_json);
    this.distances = initDistance(keypoint_json, this.keypoints);

    this.initOcclusion();

    const factory = new InstrumentFactory();
    factory.instantiate_instrument(
      "microphone",
      this
    );


    if (debug) this.initDebug();
    this.animate();
  }

  initOcclusion() {
    this.keypoints.forEach((keypoint) => {
      if (keypoint.type == "right_hand")
        this.add3DObject(Occluser.phalanx(keypoint));
    });
  }

  initDebug() {
    this.keypoints.forEach((keypoint) => {
      this.add3DObject(new Disk(keypoint));
    });
  }

  update_keypoints(new_keypoints) {
    this.keypoints.forEach((kp) => {
      kp.update(new_keypoints);
    });
  }

  async animate() {
    let nb_calls_render = 0;

    setInterval(() => {
      document.getElementById("frameRateRender").innerHTML =
        "Render FrameRate: " + nb_calls_render;
      nb_calls_render = 0;
    }, 1000);

    /* eslint @typescript-eslint/no-this-alias: 0 */
    const self = this;

    async function render() {
      nb_calls_render++;
      self.objects.forEach((obj) => {
        if (obj instanceof BodyTrackerObject)
          obj.animate(self.distances[obj.keypoint.type].getValue());
        else if (obj instanceof Microphone)
        {
          obj.animate();
        }
      });

      self.renderer.render(self.scene, self.camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}
