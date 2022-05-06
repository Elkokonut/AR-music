import * as THREE from 'three';
import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import Object3D from '../Object3D';
import Keypoint from '../../../Geometry/Keypoint';


export default class Interface extends Object3D {

    interface : Object3D;
    children: Object3D[];

    constructor(scene : BodyTrackerScene)
    {
        super(new ThreeMeshUI.Block({
            fontSize: 12,
            padding: 0.02,
            borderRadius: 0.11,
            backgroundOpacity: 0,
            justifyContent: 'center',
            contentDirection: 'row-reverse',
            fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
            fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
        }), "interface", null);
        this.children = [];
        
        this.children.push(new Button("Microphone", 
        function () { 
            scene.factory.change_instrument("microphone", scene);
        }));

        this.children.push(new Button("Drums", 
        function () { 
            scene.factory.change_instrument("drums", scene);
        }));

        this.obj.add(...this.children.map(c => c.obj));
    }

    interact(keypoints : Keypoint[]) {
        this.children.forEach(child => {
        if (child instanceof Button)
            child.checkTrigger(keypoints);
        });

    }
}