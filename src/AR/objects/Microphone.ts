import * as THREE from "three";
import Distance from "../../tools/Distance";
import Keypoint from "../../tools/Keypoint";
import Object3D from "./Object3D";

export default class Microphone extends Object3D {
  keypoints: Keypoint[];
  constructor(obj, name, keypoints, scale) {
    super(obj, name, scale);
    this.obj.visible = false;
    this.keypoints = keypoints;
  }

  animate() {
    // Compute anchor and kp_align_pos from given keypoints
    //keypoints from hand:
    //          [1]         [3]
    //      align|           |anchor              we want middle points here.
    //          [0]         [2]
    // THUMB HERE
    const anchor = new THREE.Vector3();
    const kp_align_pos = new THREE.Vector3();
    const left_middle = new THREE.Vector3();
    const right_middle = new THREE.Vector3();

    left_middle.subVectors(this.keypoints[1].position, this.keypoints[0].position).multiplyScalar(2 / 3);
    right_middle.subVectors(this.keypoints[3].position, this.keypoints[2].position).multiplyScalar(1 / 2);
    kp_align_pos.addVectors(this.keypoints[0].position, left_middle);
    anchor.addVectors(this.keypoints[2].position, right_middle);

    this.obj.position.x = anchor.x;
    this.obj.position.y = anchor.y;
    this.obj.position.z = anchor.z;

    this.obj.visible = this.keypoints[0].is_visible;
    // Get align vector from anchor referential.s
    const local_kp_align_pos = new THREE.Vector3();
    local_kp_align_pos.subVectors(kp_align_pos, anchor).normalize();
    this.obj.rotation.z =
      -Math.sign(local_kp_align_pos.x) * this.obj.up.angleTo(local_kp_align_pos);

    let distance = Distance.getDistance(anchor, kp_align_pos, [20, 100], [-0.9999999, 1])
    super.animate(distance);
  }
}
