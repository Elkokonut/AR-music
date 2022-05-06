import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import Keypoint from '../../../Geometry/Keypoint';
import Object3D from '../Object3D';

export default class Button extends Object3D {
    static instancesCounter: number = 0;
    action: (x) => void;
    counter: number;
    bbox: THREE.Box3;

    constructor(
        content: string = null,
        action = null,
        btnOptions = null,
        hoveredStateAttributes = null,
        idleStateAttributes = null,
        selectedAttributes = null
    ) {
        if (!btnOptions)
            btnOptions = {
                width: 100,
                height: 100,
                justifyContent: 'center',
                offset: 0.05,
                margin: 0.02,
                borderRadius: 0.075
            };

        if (!hoveredStateAttributes)
            hoveredStateAttributes = {
                state: 'hovered',
                attributes: {
                    offset: 0.035,
                    backgroundColor: new THREE.Color(0x999999),
                    backgroundOpacity: 1,
                    fontColor: new THREE.Color(0xffffff)
                },
            };

        if (!idleStateAttributes)
            idleStateAttributes = {
                state: 'idle',
                attributes: {
                    offset: 0.035,
                    backgroundColor: new THREE.Color(0x666666),
                    backgroundOpacity: 0.3,
                    fontColor: new THREE.Color(0xffffff)
                },
            };

        if (!selectedAttributes)
            selectedAttributes = {
                offset: 0.02,
                backgroundColor: new THREE.Color(0x777777),
                fontColor: new THREE.Color(0x222222)
            };

        super(new ThreeMeshUI.Block(btnOptions), `button_${Button.instancesCounter++}`, null);
        this.obj.add(new ThreeMeshUI.Text({ content: content }));

        this.action = action;
        this.counter = 0;
        this.bbox = new THREE.Box3().setFromObject(this.obj);
        this.bbox.min.setZ(-1);

        this.obj.setupState({
            state: 'selected',
            attributes: selectedAttributes,
            onSet: () => {
                if (this.action)
                    this.action.call(this);
            }
        });
        this.obj.setupState(hoveredStateAttributes);
        this.obj.setupState(idleStateAttributes);
    }

    checkTrigger(keypoints: Keypoint[]) {
        this.bbox = new THREE.Box3().setFromObject(this.obj);
        this.bbox.min.setZ(-1);
        let collision = false;
        keypoints.forEach(kp => { collision = collision || (kp.is_visible && this.bbox.containsPoint(kp.position)); });

        if (collision) {
            this.onHover()
            if (this.counter == 3)
                this.onSelected();
        }
        else {
            this.onIdle();
        }
    }

    onHover() {
        this.counter++;
        this.obj.setState('hovered')
    }

    onSelected() {
        if (this.action)
            this.action.call(this);
        this.obj.setState('selected');
        this.counter = 0;
    }

    onIdle() {
        this.counter = 0;
        this.obj.setState("idle");
    }
}