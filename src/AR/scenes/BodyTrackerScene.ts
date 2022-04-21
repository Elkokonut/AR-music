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
import Phalanx from "../objects/Phalanx";
import Palm from "../objects/Palm";

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
    const sides = ["right", "left"];
    const fingers = ["thumb", "index_finger", "middle_finger", "ring_finger", "pinky_finger"];
    sides.forEach(side =>
      fingers.forEach(finger => {
        const bot = this.keypoints.find(keypoint => keypoint.name == `${side}_${finger}_mcp`);
        let mid = null;
        if (finger == "thumb")
          mid = this.keypoints.find(keypoint => keypoint.name == `${side}_${finger}_ip`);
        else
          mid = this.keypoints.find(keypoint => keypoint.name == `${side}_${finger}_pip`);
        const top = this.keypoints.find(keypoint => keypoint.name == `${side}_${finger}_tip`);

        this.append3DObject(new Phalanx([bot.position, mid.position], mid));
        this.append3DObject(new Phalanx([mid.position, top.position], mid));
      }
      )
    );
    this.append3DObject(
      new Palm(
        [
          this.keypoints.find(keypoint => keypoint.name == `right_index_finger_mcp`),
          this.keypoints.find(keypoint => keypoint.name == `right_pinky_finger_mcp`),
          this.keypoints.find(keypoint => keypoint.name == `right_wrist`),
          this.keypoints.find(keypoint => keypoint.name == `right_thumb_cmc`)
        ],
        this.keypoints.find(keypoint => keypoint.name == `right_index_finger_mcp`)
      
      )
    );

    this.append3DObject(
      new Palm(
        [
          this.keypoints.find(keypoint => keypoint.name == `left_index_finger_mcp`),
          this.keypoints.find(keypoint => keypoint.name == `left_pinky_finger_mcp`),
          this.keypoints.find(keypoint => keypoint.name == `left_wrist`),
          this.keypoints.find(keypoint => keypoint.name == `left_thumb_cmc`)
        ],
        this.keypoints.find(keypoint => keypoint.name == `left_index_finger_mcp`)
      
      )
    );

  }

  initDebug() {
    this.keypoints.forEach((keypoint) => {
      this.append3DObject(new Disk(keypoint));
    });
  }

  update_keypoints(new_keypoints) {
    this.keypoints.forEach((kp) => {
      kp.update(new_keypoints);
    });
  }

  async animate() {
    /* eslint @typescript-eslint/no-this-alias: 0 */
    const self = this;

    async function render() {
      let microphone_distance = 0;
      self.objects.forEach((obj) => {
        if (obj instanceof BodyTrackerObject)
          obj.animate(self.distances[obj.keypoint.type].getValue());
        else if (obj instanceof Microphone) {
          obj.animate();
          microphone_distance = Microphone.base_dimension_Z * obj.obj.scale.z;
          obj.play_sound(self.keypoints.find(
            (keypoint) => keypoint.type == "body" && keypoint.order == 10
          ));
        }
        else if (obj instanceof Phalanx) {
          obj.animate(microphone_distance);
        }
        else if (obj instanceof Palm) {
          obj.animate(microphone_distance);
        }
      });

      self.renderer.render(self.scene, self.camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}
