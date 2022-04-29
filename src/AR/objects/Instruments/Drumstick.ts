import * as THREE from "three";
import Keypoint from "../../../Geometry/Keypoint";
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

  animate(display) {
    this.obj.visible = this.keypoints[0].is_visible && display;

    if (this.obj.visible) {
      this.move(this.keypoints);
      this.box = new THREE.Box3().setFromObject(this.obj);
    }
  }

  move(keypoints: Keypoint[]) {
    const anchor = new THREE.Vector3();
    const kp_align_pos = new THREE.Vector3();

    anchor.subVectors(keypoints[1].position, keypoints[0].position)
      .multiplyScalar(1 / 2)
      .add(keypoints[0].position);

    kp_align_pos.subVectors(keypoints[3].position, keypoints[2].position)
      .multiplyScalar(1 / 2)
      .add(keypoints[2].position);

    this.obj.position.x = anchor.x;
    this.obj.position.y = anchor.y;
    this.obj.position.z = anchor.z;
    // Get align vector from anchor referential.s
    const align_vector = new THREE.Vector3();
    align_vector.subVectors(kp_align_pos, anchor).normalize();
    this.obj.rotation.z = - Math.sign(align_vector.x) * this.obj.up.angleTo(align_vector) + Math.PI;
  }
}

