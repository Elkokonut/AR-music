import BodyTrackerObject from "./BodyTrackerObject";
import * as THREE from "three";
import Keypoint from "../../tools/Keypoint";

export default class Microphone extends BodyTrackerObject {
  align_keypoint: Keypoint;
  constructor(obj, name, anchor, align_keypoint, scale) {
    super(obj, name, anchor, scale);
    this.align_keypoint = align_keypoint;
  }

  animate(distance) {
    super.animate(distance);
    const kp_align_pos = new THREE.Vector3();
    const v2 = new THREE.Vector3(
      this.align_keypoint.x,
      this.align_keypoint.y,
      0
    );
    kp_align_pos.subVectors(v2, this.obj.position).normalize();
    this.obj.rotation.z =
      -Math.sign(kp_align_pos.x) * this.obj.up.angleTo(kp_align_pos);
  }
}
