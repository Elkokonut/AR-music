declare function require(name: string);

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Microphone from "./Microphone";

export default class InstrumentFactory {
  instantiate_instrument(type, scene) {
    switch (type) {
      case "microphone":
        this._load_microphone(scene);
        break;

      default:
        console.log("This is not a valid instrument type");
        break;
    }
  }

  _load_microphone(scene) {
    const model_path = require("../../../static/models/mic/microphone.fbx");
    const name = "mic";
    const keypoints = [
      scene.keypoints.find(
        (keypoint) => keypoint.type == "right_hand" && keypoint.order == 1
      ),
      scene.keypoints.find(
        (keypoint) => keypoint.type == "right_hand" && keypoint.order == 5
      ),
      scene.keypoints.find(
        (keypoint) => keypoint.type == "right_hand" && keypoint.order == 0
      ),
      scene.keypoints.find(
        (keypoint) => keypoint.type == "right_hand" && keypoint.order == 17
      ),
    ];
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
          metalnessMap: metallicMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
        });

        for (const child of object.children) {
          child.material = minigunMaterial;
        }

        console.log(object);
        const inst = new Microphone(
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
}
