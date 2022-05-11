import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import Object3D from '../Object3D';

export enum ToogleType {
    Next= "next",
    Prev = "prev"
}

export default class Toggle extends Object3D {
    static instancesCounter = 0;
    counter: number;
    type:ToogleType;


    constructor(
        content: string = null,
        type=ToogleType.Next,
        btnOptions = null,
        hoveredStateAttributes = null,
        idleStateAttributes = null,
        selectedAttributes = null
    ) {
        if (!btnOptions)
            btnOptions = {
                width: 1,
                height: 1,
                justifyContent: 'center',
                borderRadius: 0.2,
                offset: 0.05,
                margin: 0.02,
            };

        if (!hoveredStateAttributes)
            hoveredStateAttributes = {
                state: 'hovered',
                attributes: {
                    offset: 0.035,
                    backgroundColor: new THREE.Color(0x008080),
                    backgroundOpacity: 0.7,
                    fontColor: new THREE.Color(0xffffff)
                },
            };

        if (!idleStateAttributes)
            idleStateAttributes = {
                state: 'idle',
                attributes: {
                    offset: 0.035,
                    backgroundColor: new THREE.Color(0x229999),
                    backgroundOpacity: 0.5,
                    fontColor: new THREE.Color(0xffffff)
                },
            };

        if (!selectedAttributes)
            selectedAttributes = {
                state: 'selected',
                attributes: {
                    offset: 0.02,
                    backgroundOpacity: 1,
                    backgroundColor: new THREE.Color(0x12a69e),
                    fontColor: new THREE.Color(0xffffff)
                }
            };

        super(new ThreeMeshUI.Block(btnOptions), `button_${Toggle.instancesCounter++}`, null);
        // if (content)
            this.obj.add(new ThreeMeshUI.Text({ content: content }));
        this.type = type;
        this.counter = 0;
        this.obj.setupState(selectedAttributes);
        this.obj.setupState(hoveredStateAttributes);
        this.obj.setupState(idleStateAttributes);
        this.onIdle();
    }

    onHover() {
        this.counter++;
        this.obj.setState('hovered')
    }

    onIdle() {
            this.counter = 0;
            this.obj.setState("idle");
    }
}


