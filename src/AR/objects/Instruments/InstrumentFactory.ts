declare function require(name: string);

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Microphone from "./Microphone";
import Drum from "./Drum";
import Drumstick from "./Drumstick";

export default class InstrumentFactory {
  instantiate_instrument(type, scene) {
    switch (type) {
      case "microphone":
        this._load_microphone(scene);
        break;

      case "drums":
        this._load_red_drum(scene);
        this._load_ancien_drum(scene);
        this._load_drumsticks(scene);
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
    const right_keypoints = [
      scene.keypoints.find((keypoint) => keypoint.name == "right_thumb_cmc"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_index_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_wrist"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_pinky_finger_mcp")
    ];

    const left_keypoints = [
      scene.keypoints.find((keypoint) => keypoint.name == "left_thumb_cmc"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_index_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_wrist"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_pinky_finger_mcp")
    ];
    fbxLoader.load(
      model_path,
      async (right_object) => {
        console.log("success in loading Drumstick");
        const left_object = right_object.clone();
        const right_inst = new Drumstick(
          right_object,
          "right_drumstick",
          right_keypoints,
          [0.2, 0.2, 0.2]
        );
        const left_inst = new Drumstick(
          left_object,
          "left_drumstick",
          left_keypoints,
          [0.2, 0.2, 0.2]
        );
        scene.prepend3DObject(right_inst);
        scene.prepend3DObject(left_inst);
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

        object.getObjectByName("Box39").removeFromParent();
        object.getObjectByName("Cylinder15").removeFromParent();

        const scale = 0.55;
        const drum = new Drum(
          object,
          "red_drum",
          new THREE.Vector3(5, -16, 0),
          new THREE.Vector3(scale / 1440, scale / 1080, scale / 1080),
          require("url:../../../../static/sound sample/snare.wav"
          )
        );
        scene.append3DObject(drum);
        drum.obj.renderOrder = 0;
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

          const scale = 20;
          const drum = new Drum(
            object,
            "ancien_drum",
            new THREE.Vector3(-5, -11, 0),
            new THREE.Vector3(scale / 1440, scale / 1080, scale / 1080),
            require("url:../../../../static/sound sample/drum.wav"
            )
          );
          scene.append3DObject(drum);
          drum.obj.renderOrder = 0;
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
