declare function require(name: string);

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Microphone from "./Microphone";
import Drum from "./Drum";
import Object3D from "../Object3D";

export default class InstrumentFactory {
  instruments: { [key: string]: Object3D[] };
  loadingModel: number;

  loadingManager: THREE.LoadingManager;

  constructor() {
    this.instruments = {};
    this.loadingModel = 0;
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = () => this.onStart();
    this.loadingManager.onLoad = () => this.onLoad();
  }

  onStart() {
    this.loadingModel++;
  }

  onLoad() {
    this.loadingModel--;
  }

  change_instrument(type, scene) {
    if (this.loadingModel == 0) {
      if (this.instruments["microphone"] && type != "microphone") {
        scene.removeByName("mic");
      }
      else if (type == "microphone") {
        if (!this.instruments["microphone"])
          this._load_microphone(scene);
        else if (!scene.objects.includes(this.instruments["microphone"][0]))
          scene.prepend3DObject(this.instruments["microphone"][0]);
      }
      if (this.instruments["drums"] && type != "drums") {
        scene.removeByName("ancien_drum_left");
        scene.removeByName("ancien_drum_right");
      }
      else if (type == "drums") {
        if (!this.instruments["drums"]) {

          this._load_ancien_drum(scene);
        }
        else if (!scene.objects.includes(this.instruments["drums"][0])) {
          this.instruments["drums"].forEach((obj) => {
            scene.prepend3DObject(obj);
            if (obj.obj.name == "ancien_drum_left" || obj.obj.name == "ancien_drum_right")
              obj.obj.renderOrder = 0;
          });
        }
      }
    }
  }

  instantiate_instrument(type, scene) {
    switch (type) {
      case "microphone":
        this._load_microphone(scene);
        break;

      case "drums":
        //this._load_red_drum(scene);
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
      scene.keypoints.find((keypoint) => keypoint.name == "right_index_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_index_finger_pip"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_pinky_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_pinky_finger_pip")
    ];
    const fbxLoader = new FBXLoader(this.loadingManager);
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

        const inst = new Microphone(
          object.children[0],
          name,
          keypoints,
          [10, 10, 10]
        );

        this.instruments["microphone"] = [inst];
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

  _load_ancien_drum(scene) {
    const obj_path = require("../../../../static/models/NAMDrum/NAMDrum01.obj");
    new OBJLoader(this.loadingManager)
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
          const drum_left = new Drum(
            object.clone(),
            "ancien_drum_left",
            new THREE.Vector3(-5, -13, 0),
            new THREE.Vector3(scale / 1440, scale / 1080, scale / 1080),
            require("url:../../../../static/sound sample/drum.wav"
            )
          );

          const drum_right = new Drum(
            object.clone(),
            "ancien_drum_right",
            new THREE.Vector3(5, -13, 0),
            new THREE.Vector3(scale / 1440, scale / 1080, scale / 1080),
            require("url:../../../../static/sound sample/drum.wav"
            )
          );

          if (!this.instruments["drums"])
            this.instruments["drums"] = [];
          this.instruments["drums"].push(drum_left);
          this.instruments["drums"].push(drum_right);

          scene.append3DObject(drum_left);
          scene.append3DObject(drum_right);
          drum_left.obj.renderOrder = 0;
          drum_right.obj.renderOrder = 0;
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
