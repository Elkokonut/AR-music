declare function require(name: string);

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Microphone from "./Microphone";

export default class InstrumentFactory {
  instantiate_instrument(type, scene) {
    switch (type) {
      case "microphone":
        this._load_microphone(scene);
        break;

      case "drums":
        // this._load_red_drum(scene);
        this._load_ancien_drum(scene);
        break;

      default:
        console.log("This is not a valid instrument type");
        break;
    }
  }

  _load_microphone(scene) {
    const model_path = require("../../../../static/models/mic/microphone.fbx");
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
          require("../../../../static/models/mic/textures/Microphone_FBX_Microphone_BaseColor.png")
        );
        const metallicMap = await textureLoader.load(
          require("../../../../static/models/mic/textures/Microphone_FBX_Microphone_Metalness.png")
        );
        const normalMap = await textureLoader.load(
          require("../../../../static/models/mic/textures/Microphone_FBX_Microphone_Normal.png")
        );
        const roughnessMap = await textureLoader.load(
          require("../../../../static/models/mic/textures/Microphone_FBX_Microphone_Roughness.png")
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
        scene.prepend3DObject(inst);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  }



  _load_drumsticks(scene) {
    const model_path = require("../../../../static/models/drumstick/drumstick.fbx");
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      model_path,
      async (object) => {
        console.log("success in loading Drumstick");
        scene.scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  }


  _load_red_drum(scene) {
    const model_path = require("../../../../static/models/red_drum/red_drum.3DS");
    const tdsLoader = new TDSLoader();
    tdsLoader.load(
      model_path,
      async (object) => {
        console.log("success in loading red Drum");

        object.scale.x = 0.1;
        object.scale.y = 0.1;
        object.scale.z = 0.1;
        object.up.x = 1;
        object.up.y = 0;

        console.log(object);
        scene.scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  }


  _load_ancien_drum(scene) {
    const obj_path = require("../../../../static/models/NAMDrum/NAMDrum01.obj");
    new OBJLoader()
      .load(obj_path,
        async (object) => {
          console.log("success in loading ancien drum");
          object.scale.x = 5;
          object.scale.y = 5;
          object.scale.z = 5;
          object.up.x = 1;
          const textureLoader = new THREE.TextureLoader();
          const baseColorMap = await textureLoader.load(
            require("../../../../static/models/NAMDrum/NAMDrum01.jpg")
          );
          const drumMaterial = new THREE.MeshStandardMaterial({
            map: baseColorMap
          });
          for (const child of object.children) {
            child.material = drumMaterial;
          }
          console.log(object);
          scene.scene.add(object);
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
