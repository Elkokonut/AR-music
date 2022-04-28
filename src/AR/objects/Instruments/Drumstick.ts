import * as THREE from "three";
import Distance from "../../../tools/Distance";
import Keypoint from "../../../tools/Keypoint";
import Object3D from "../Object3D";

export default class Drumstick extends Object3D {
  keypoints: Keypoint[];
  box: THREE.Box3;
  static base_dimension_Z = 17.54;

  constructor(obj, name, keypoints, scale) {
    super(obj, name, scale);
    // this.obj.visible = false;
    this.keypoints = keypoints;
    this.box = new THREE.Box3().setFromObject(this.obj);
  }

  animate() {
    // Compute anchor and kp_align_pos from given keypoints
    //keypoints from hand:
    //          [1]         [3]
    //      align|           |anchor              we want middle points here.
    //          [0]         [2]
    // THUMB HERE

    this.obj.visible = this.keypoints[0].is_visible;

    if (this.obj.visible) {      
      super.animate(this.move(this.keypoints));
      this.box = new THREE.Box3().setFromObject(this.obj);
    }
  }

  move(keypoints : Keypoint[]) {
    const anchor = new THREE.Vector3();
    const left_middle = new THREE.Vector3();
    const kp_align_pos = new THREE.Vector3();
    const right_middle = new THREE.Vector3();

    left_middle.subVectors(keypoints[1].position, keypoints[0].position)
      .multiplyScalar(1 / 2)
      .add(keypoints[0].position);

    right_middle.subVectors(keypoints[3].position, keypoints[2].position)
      .multiplyScalar(1 / 2)
      .add(keypoints[2].position);

    kp_align_pos.addVectors(left_middle, right_middle).multiplyScalar(1 / 2);
    anchor.add(left_middle);

    this.obj.position.x = anchor.x;
    this.obj.position.y = anchor.y;
    this.obj.position.z = anchor.z;
    // Get align vector from anchor referential.s
    const align_vector = new THREE.Vector3();
    align_vector.subVectors(kp_align_pos, anchor).normalize();
    this.obj.rotation.z = - Math.sign(align_vector.x) * this.obj.up.angleTo(align_vector) + Math.PI;
    return Distance.getDistance(anchor, kp_align_pos, [10, 50], [-0.9999999, 1]);
  }
}

