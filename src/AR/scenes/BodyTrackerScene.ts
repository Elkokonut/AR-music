declare function require(name: string);
const keypoint_json = require("../../../static/json/keypoints.json");
import Scene from "./Scene";
import Disk from "../objects/Trackers/Disk";
import { generateKeypoints } from "../../tools/keypoints_helper";
import Keypoint from "../../tools/Keypoint";
import Distance from "../../tools/Distance";
import BodyTrackerObject from "../objects/Trackers/BodyTrackerObject"

import InstrumentFactory from "../objects/Instruments/InstrumentFactory";
import Microphone from "../objects/Instruments/Microphone";
import Phalanx from "../objects/Occlusers/Phalanx";
import Palm from "../objects/Occlusers/Palm";
import Drum from "../objects/Instruments/Drum";
import Drumstick from "../objects/Instruments/Drumstick";
import Hand from "../../tools/Hand";

export default class BodyTrackerScene extends Scene {
  keypoints: Keypoint[];
  factory: InstrumentFactory;
  leftHand: Hand;
  rightHand: Hand;

  constructor(video, debug) {
    super(video, debug);
    this.keypoints = generateKeypoints(keypoint_json);
    this.factory = new InstrumentFactory();

    this.leftHand = new Hand(this.keypoints.filter(keypoint => keypoint.type == "left_hand"));
    this.rightHand = new Hand(this.keypoints.filter(keypoint => keypoint.type == "right_hand"));
    this.initOcclusion();
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
      if (keypoint.type != "body")
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
      let occluser_dist = 0;
      self.rightHand.refresh();
      self.leftHand.refresh();

      self.objects.forEach((obj) => {
        if (obj instanceof BodyTrackerObject)
          obj.animate();
        else if (obj instanceof Phalanx) {
          obj.animate(occluser_dist);
        }
        else if (obj instanceof Palm) {
          obj.animate(occluser_dist);
        }
        else if (obj instanceof Drum) {
          obj.animate(self.objects.filter(
            (stick) => stick.obj.name.includes("drumstick")
          )
          );
        }
        else if (obj instanceof Microphone) {
          obj.animate();
          occluser_dist = Math.max(occluser_dist, Microphone.base_dimension_Z * obj.obj.scale.z);
          obj.play_sound(self.keypoints.find(
            (keypoint) => keypoint.type == "body" && keypoint.order == 10
          ));
          obj.obj.visible = obj.obj.visible ? self.rightHand.is_closed : false;
        }
        else if (obj instanceof Drumstick) {
          obj.animate();
          if (obj.obj.name.includes("left"))
            obj.obj.visible = obj.obj.visible ? self.leftHand.is_closed : false;
          else
            obj.obj.visible = obj.obj.visible ? self.rightHand.is_closed : false;
        }

        occluser_dist = Math.max(occluser_dist, Drumstick.base_dimension_Z * obj.obj.scale.z);
      });

      self.renderer.render(self.scene, self.camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
}
