declare function require(name: string);

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Microphone from "./Microphone";
import Drum from "./Drum";
import Drumstick from "./Drumstick";
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

  isLoaded(instrument) {
    if (this.instruments[instrument])
      return true;
    return false;
  }

  onStart() {
    this.loadingModel++;
    globalThis.APPNamespace.App.ui.showModelLoading();
  }

  onLoad() {
    this.loadingModel--;
    globalThis.APPNamespace.App.ui.hideModelLoading();
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
        scene.removeByName("right_drumstick");
        scene.removeByName("left_drumstick");
        scene.removeByName("ancien_drum");
        scene.removeByName("red_drum");
      }
      else if (type == "drums") {
        if (!this.instruments["drums"]) {
          this._load_red_drum(scene);
          this._load_ancien_drum(scene);
          this._load_drumsticks(scene);
        }
        else if (!scene.objects.includes(this.instruments["drums"][0])) {
          this.instruments["drums"].forEach((obj) => {
            scene.prepend3DObject(obj);
            if (obj.obj.name == "ancien_drum" || obj.obj.name == "red_drum")
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



  _load_drumsticks(scene) {
    const model_path = require("../../../../static/models/drumstick/drumstick.fbx");
    const fbxLoader = new FBXLoader(this.loadingManager);
    const right_keypoints = [
      scene.keypoints.find((keypoint) => keypoint.name == "right_index_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_index_finger_pip"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_pinky_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "right_pinky_finger_pip")
    ];

    const left_keypoints = [
      scene.keypoints.find((keypoint) => keypoint.name == "left_index_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_index_finger_pip"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_pinky_finger_mcp"),
      scene.keypoints.find((keypoint) => keypoint.name == "left_pinky_finger_pip")
    ];
    fbxLoader.load(
      model_path,
      async (right_object) => {
        console.log("success in loading Drumstick");
        const left_object = right_object.clone();
        const right_stick = new Drumstick(
          right_object,
          "right_drumstick",
          right_keypoints,
          [0.2, 0.2, 0.2]
        );
        const left_stick = new Drumstick(
          left_object,
          "left_drumstick",
          left_keypoints,
          [0.2, 0.2, 0.2]
        );

        if (!this.instruments["drums"])
          this.instruments["drums"] = [];

        this.instruments["drums"].push(right_stick);
        this.instruments["drums"].push(left_stick);

        scene.prepend3DObject(right_stick);
        scene.prepend3DObject(left_stick);
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
    const tdsLoader = new TDSLoader(this.loadingManager);
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

        if (!this.instruments["drums"])
          this.instruments["drums"] = [];
        this.instruments["drums"].push(drum);

        scene.append3DObject(drum);
        drum.obj.renderOrder = 1;
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
          const drum = new Drum(
            object,
            "ancien_drum",
            new THREE.Vector3(-5, -11, 0),
            new THREE.Vector3(scale / 1440, scale / 1080, scale / 1080),
            require("url:../../../../static/sound sample/drum.wav"
            )
          );

          if (!this.instruments["drums"])
            this.instruments["drums"] = [];
          this.instruments["drums"].push(drum);

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
