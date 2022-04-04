import * as THREE from 'three';
import oc from 'three-orbit-controls';
import BodyTrackerObject from '../objects/BodyTrackerObject';

export default class Scene {
    video: HTMLVideoElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    /* eslint @typescript-eslint/no-explicit-any: 0 */
    controls: any;
    initialisation: boolean;
    objects: BodyTrackerObject[];

    constructor(video) {
        this.video = video;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.initialisation = false;

        this.objects = []
    }

    init() {
        console.log("Init Scene");
        

        const ratio = window.innerWidth / this.video.videoWidth;
        const renderheight = ratio * this.video.videoHeight;

        globalThis.APPNamespace.height = renderheight;
        globalThis.APPNamespace.width = window.innerWidth;


        this.scene = new THREE.Scene();
        this.scene.background = new THREE.VideoTexture(this.video);
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / renderheight, 0.1, 0);
        // this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, .1, 1000);
        this.camera.position.z = renderheight;
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, renderheight);
        document.body.appendChild(this.renderer.domElement);

        this.initialisation = true;
    }

    add3DObject(obj3D)
    {
        this.scene.add(obj3D.obj);
        this.objects.push(obj3D);
    }

    addControls() {
        this.controls = new oc(THREE)(this.camera, this.renderer.domElement);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }

}