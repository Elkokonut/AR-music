declare function require(name: string);
const keypoint_json = require("../../../static/json/keypoints.json");
import Scene from "./Scene";
import * as THREE from "three";
import Disk from "../objects/Trackers/Disk";
import Keypoint from "../../Geometry/Keypoint";
import BodyTrackerObject from "../objects/Trackers/BodyTrackerObject";

import InstrumentFactory from "../objects/Instruments/InstrumentFactory";
import Microphone from "../objects/Instruments/Microphone";
import Phalanx from "../objects/Occlusers/Phalanx";
import Palm from "../objects/Occlusers/Palm";
import Drum from "../objects/Instruments/Drum";
import Hand from "../../Geometry/Hand";
import Occluser from "../objects/Occlusers/Occluser";
import * as ThreeMeshUI from "three-mesh-ui";
import Interface from "../objects/Interface/Interface";
import Classifier from "../../AI/Classifier";

import soundManager from "../../tools/SoundManager";


export default class BodyTrackerScene extends Scene {
  keypoints: Keypoint[];
  factory: InstrumentFactory;
  leftHand: Hand;
  rightHand: Hand;
  interface: Interface;
  classifier: Classifier;
  soundManager: soundManager;

  constructor(video, debug) {
    super(video, debug);
    this.classifier = new Classifier();
    this.keypoints = Keypoint.generateKeypoints(keypoint_json);
    this.factory = new InstrumentFactory();
    this.soundManager = new soundManager();

    this.leftHand = new Hand(
      this.keypoints.filter((keypoint) => keypoint.type == "left_hand")
    );
    this.rightHand = new Hand(
      this.keypoints.filter((keypoint) => keypoint.type == "right_hand")
    );

    this.initOcclusion();

    this.interface = new Interface(this);
    if (debug) this.initDebug();

    globalThis.APPNamespace.detectInstrument = true;
    this.animate();
  }

  initOcclusion() {
    const sides = ["right", "left"];
    const fingers = [
      "thumb",
      "index_finger",
      "middle_finger",
      "ring_finger",
      "pinky_finger",
    ];
    sides.forEach((side) =>
      fingers.forEach((finger) => {
        const bot = this.keypoints.find(
          (keypoint) => keypoint.name == `${side}_${finger}_mcp`
        );
        let mid = null;
        if (finger == "thumb")
          mid = this.keypoints.find(
            (keypoint) => keypoint.name == `${side}_${finger}_ip`
          );
        else
          mid = this.keypoints.find(
            (keypoint) => keypoint.name == `${side}_${finger}_pip`
          );
        const top = this.keypoints.find(
          (keypoint) => keypoint.name == `${side}_${finger}_tip`
        );

        this.append3DObject(new Phalanx([bot.position, mid.position], mid, side));
        this.append3DObject(new Phalanx([mid.position, top.position], mid, side));
      })
    );
    this.append3DObject(
      new Palm(
        [
          this.keypoints.find(
            (keypoint) => keypoint.name == `right_index_finger_mcp`
          ),
          this.keypoints.find(
            (keypoint) => keypoint.name == `right_pinky_finger_mcp`
          ),
          this.keypoints.find((keypoint) => keypoint.name == `right_wrist`),
          this.keypoints.find((keypoint) => keypoint.name == `right_thumb_cmc`),
        ],
        this.keypoints.find(
          (keypoint) => keypoint.name == `right_index_finger_mcp`
        ),
        "right"
      )
    );

    this.append3DObject(
      new Palm(
        [
          this.keypoints.find(
            (keypoint) => keypoint.name == `left_index_finger_mcp`
          ),
          this.keypoints.find(
            (keypoint) => keypoint.name == `left_pinky_finger_mcp`
          ),
          this.keypoints.find((keypoint) => keypoint.name == `left_wrist`),
          this.keypoints.find((keypoint) => keypoint.name == `left_thumb_cmc`),
        ],
        this.keypoints.find(
          (keypoint) => keypoint.name == `left_index_finger_mcp`
        ),
        "left"
      )
    );
  }

  initDebug() {
    this.keypoints.forEach((keypoint) => {
      if (keypoint.type != "body") this.append3DObject(new Disk(keypoint));
    });
  }

  update_keypoints(new_keypoints) {
    this.keypoints.forEach((kp) => {
      kp.update(new_keypoints);
    });
  }

  async signHandler() {
    if (this.classifier.isLearning) {
      this.classifier.addExample(this.leftHand, this.rightHand);
    } else if (this.classifier.enabled) {
      const prediction = await this.classifier.predict(
        this.leftHand,
        this.rightHand
      );
      if (prediction == "microphone")
        this.factory.change_instrument("microphone", this);
      else if (prediction == "drums")
        this.factory.change_instrument("drums", this);
      else if (prediction != "") {
        this.factory.change_instrument("", this);
        this.soundManager.playSound(prediction);
      }
    }
  }

  interact() {

    this.interface.interact([
      this.keypoints.find(
        (keypoint) => keypoint.name == `right_index_finger_tip`
      ),
      this.keypoints.find(
        (keypoint) => keypoint.name == `left_index_finger_tip`
      ),
    ]
      .filter((kp) => kp.is_visible)
      .map((kp) => {
        const pointer = new THREE.Vector2(
          (kp.position.x / globalThis.APPNamespace.canvasWidth) * 2,
          (kp.position.y / globalThis.APPNamespace.canvasHeight) * 2
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this.camera);
        return raycaster;
      })
    );
  }

  async animate() {
    /* eslint @typescript-eslint/no-this-alias: 0 */
    const self = this;

    async function render() {
      self.rightHand.refresh();
      self.leftHand.refresh();
      let occlusionZ = 0;
      self.interact();


      [
        self.keypoints.find(keypoint => keypoint.name == `right_index_finger_tip`),
        self.keypoints.find(keypoint => keypoint.name == `left_index_finger_tip`)
      ].filter(kp => kp.is_visible)
        .forEach(kp => {
          const pointer = new THREE.Vector2(kp.position.x / globalThis.APPNamespace.width * 2,
            kp.position.y / globalThis.APPNamespace.height * 2)
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(pointer, self.camera);
          self.interface.interact(raycaster);
        });

      self.objects.forEach((obj) => {
        if (obj instanceof BodyTrackerObject) obj.animate();
        else if (obj instanceof Occluser) {
          if (obj.obj.name.includes("left")) {
            obj.animate(self.leftHand.is_closed);
          }
          else {
            obj.animate(self.rightHand.is_closed);
          }
          obj.obj.position.setZ(occlusionZ);
        }
        else if (obj instanceof Drum) {
          obj.animate(self.keypoints.filter((keypoint) => keypoint.type.includes('hand')));
        }
        else if (obj instanceof Microphone) {
          let is_right_hand = false;
          if (obj.keypoints_left[0].is_visible == false)
            is_right_hand = true;
          else if (obj.keypoints_right[0].is_visible == false)
            is_right_hand = false;
          else {
            const origin = new THREE.Vector3(0, 0, 0);
            const right_distance = obj.keypoints_right[0].position.distanceTo(origin);
            const left_distance = obj.keypoints_left[0].position.distanceTo(origin);

            is_right_hand = left_distance > right_distance;
          }
          const is_closed = is_right_hand ? self.rightHand.is_closed : self.leftHand.is_closed;
          const distance = is_right_hand ? self.rightHand.distance : self.leftHand.distance;
          obj.animate(is_closed, is_right_hand);
          obj.scaling(distance);
          if (is_closed && obj.obj.visible)
            obj.play_sound();
          else
            obj.pause_sound();
          if (obj.obj.visible)
            occlusionZ = Math.max(occlusionZ, Microphone.base_dimension_Z * obj.obj.scale.z);
        }
      });

      await self.signHandler();

      ThreeMeshUI.update();

      self.render();

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  resize(): void {
    super.resize();

    this.interface.resize();
  }
}
