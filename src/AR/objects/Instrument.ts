declare function require(name:string);

import * as THREE from 'three';
import BodyTrackerObject from './BodyTrackerObject';
import Keypoint from '../../tools/Keypoint'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


export default class Instrument extends BodyTrackerObject {
    keypoints: Array<Keypoint>;

    private constructor(obj, name, keypoints, scale) {
        super(obj, name, keypoints[0], scale);
        this.keypoints = keypoints;
    }

    static instrument_from_model(model_path, name, keypoints, scene) {
        const fbxLoader = new FBXLoader();
        const textureLoader = new THREE.TextureLoader();

        fbxLoader.load(model_path, async (object) => {
            // success
            console.log("success");
            const baseColorMap = await textureLoader.load(require("../../../static/models/mic/textures/Microphone_FBX_Microphone_BaseColor.png"));
            // const heightMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_Height.png"));
            const metallicMap = await textureLoader.load(require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Metalness.png"));
            const normalMap = await textureLoader.load(require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Normal.png"));
            const roughnessMap = await textureLoader.load(require("../../../static/models/mic/textures/Microphone_FBX_Microphone_Roughness.png"));
            
            
            const minigunMaterial = new THREE.MeshStandardMaterial({
              map: baseColorMap, 
            //  displacementMap: heightMap,
              metalnessMap: metallicMap,
              normalMap: normalMap,
              roughnessMap : roughnessMap
            });
    
            for (let child of object.children) {
              child.material = minigunMaterial;
            };
            
            console.log(object);
            const inst = new Instrument(object.children[0], name, keypoints, [10,10,10]);
            
            scene.add3DObject(inst);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        }, (error) => {
                console.log(error);
            }
        );
    }

    animate(distance) {
        super.animate(distance);
        const v1 = {x: 0, y: 1}
        const v2 = {x: this.keypoints[0].x - this.keypoints[2].x, y: this.keypoints[0].x - this.keypoints[2].x,}
        const angleRad = Math.acos( (v1.x * v2.x + v1.y * v2.y) / ( Math.sqrt(v1.x*v1.x + v1.y*v1.y) * Math.sqrt(v2.x*v2.x + v2.y*v2.y) ) )
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angleRad);
        // this.obj.lookAt(0,-200,0);
    }
}