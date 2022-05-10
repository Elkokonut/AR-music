import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import Object3D from '../Object3D';

export default class Button extends Object3D {
    static instancesCounter = 0;
    action: (x) => void;
    counter: number;

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

    intersect() {
        this.onHover()
        if (this.counter == 3)
            this.onSelected();
    }

    onHover() {
        this.counter++;
        this.obj.setState('hovered')
    }

    onSelected() {
        this.obj.setState('selected');
        this.counter = 0;
    }

    onIdle() {
        this.counter = 0;
        this.obj.setState("idle");
    }
}