declare function require(name: string);

import * as THREE from "three";
import BodyTrackerObject from "./BodyTrackerObject";
import Keypoint from "../../tools/Keypoint";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class Instrument extends BodyTrackerObject {
  keypoints: Array<Keypoint>;

  private constructor(obj, name, keypoints, scale) {
    super(obj, name, keypoints[0], scale);
    this.keypoints = keypoints;
  }

  static instrument_from_model(model_path, name, keypoints, scene) {
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();

    fbxLoader.load(
      model_path,
      async (object) => {
        // success
        console.log("success");
        const baseColorMap = await textureLoader.load(
          require("../../../static/models/mic/textures/Microphone_FBX_Microphone_BaseColor.png")
        );
        // const heightMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_Height.png"));
        const metallicMap = await textureLoader.load(
          require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Metalness.png")
        );
        const normalMap = await textureLoader.load(
          require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Normal.png")
        );
        const roughnessMap = await textureLoader.load(
          require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Roughness.png")
        );

        const minigunMaterial = new THREE.MeshStandardMaterial({
          map: baseColorMap,
          //  displacementMap: heightMap,
          metalnessMap: metallicMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
        });

        for (const child of object.children) {
          child.material = minigunMaterial;
        }

        console.log(object);
        const inst = new Instrument(
          object.children[0],
          name,
          keypoints,
          [10, 10, 10]
        );

        scene.add3DObject(inst);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  animate(distance) {
    super.animate(distance);
    const kp_align_pos = new THREE.Vector3();
    const v2 = new THREE.Vector3(this.keypoints[2].x, this.keypoints[2].y, 0);
    kp_align_pos.subVectors(v2, this.obj.position).normalize();
    this.obj.rotation.z =
      -Math.sign(kp_align_pos.x) * this.obj.up.angleTo(kp_align_pos);
  }
}
