import * as THREE from "three";
import Keypoint from "../../../Geometry/Keypoint";
import Object3D from "../Object3D";

export default class Drumstick extends Object3D {
  keypoints: Keypoint[];
  box: THREE.Box3;
  static base_dimension_Z = 17.6;

  constructor(obj, name, keypoints, scale) {
    super(obj, name, scale);
    this.obj.visible = false;
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
    // Ratio computes the depth of the mic using Z values of pinky and index.
    const ratio = (this.keypoints[0].z - this.keypoints[2].z) * 10;
    kp_align_pos.add(new THREE.Vector3(0, 0, ratio * 200));

    // Rotate the object to the align point
    this.obj.lookAt(kp_align_pos); // The lookAt method align the Z axis of the object with our vector
    this.obj.rotateX((3 / 2) * Math.PI); // so now we rotate on the world X axis the object so it is on it's former local Z axis set by lookAt.
    // rotate 80 and not 90 because kp_align_pos goes a bit too far.
  }
}

