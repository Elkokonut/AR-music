import * as THREE from 'three';
import BodyTrackerObject from './BodyTrackerObject';
import Keypoint from '../../tools/Keypoint'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


export default class Instrument extends BodyTrackerObject {
    // keypoints: Array<Keypoint>;

    private constructor(obj, name, keypoint, scale) {
        super(obj, name, keypoint, scale);
        // this.keypoints = keypoint;
    }

    static instrument_from_model(model_path, name, keypoint, scene) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(model_path, (obj) => {
            // success
            console.log("success");
            
            console.log(obj);
            const inst = new Instrument(obj, name, keypoint, [10,10,10]);
            
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
    }
}