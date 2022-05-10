import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';


export default class Interface extends Object3D {
    interface: Object3D;
    children: Object3D[];

    constructor(scene: BodyTrackerScene) {
        super(new ThreeMeshUI.Block({
            fontSize: 0.1,
            padding: 0.02,
            borderRadius: 0.11,
            // backgroundOpacity: 0,
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


        this.resize();
    }

    resize() {
        const distance = 50;
        this.obj.position.setZ(globalThis.APPNamespace.height - distance);
        const height = distance;// / globalThis.APPNamespace.height * globalThis.APPNamespace.height;
        const width = distance / globalThis.APPNamespace.height * globalThis.APPNamespace.width;

        const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;

        if (ratio < 1) {
            // WEB
            const button_size = height / 8;

            // this.children.forEach(child => {
            //     // if (child instanceof Button) {
            //     //     child.obj.scale.setX(button_size).setY(button_size);
            //     //     // child.obj.position.setX(-width/2 + button_size/2 * count).setY(height / 2 - button_size/2);
            //     // }
            // })

            this.obj.scale.setY(button_size).setX(button_size);
            this.obj.position.setX(- width / 2 + button_size * 1.5).setY(height / 2 - button_size / 1.25)
        }
        else {
            // MOBILE
        }

    }


    interact(raycast: THREE.Raycast) {
        const children = this.children.map(c => c.obj);
        const intersects = raycast.intersectObjects(children);

        this.children.forEach(child => {
            if (child instanceof Button) {
                if (intersects && intersects.find(o => o.object.parent && o.object.parent.name === child.obj.name))
                    child.intersect();
                else
                    child.onIdle();
            }
        });
    }
}