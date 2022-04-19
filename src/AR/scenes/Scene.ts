import * as THREE from 'three';
import oc from 'three-orbit-controls';
import Object3D from '../objects/Object3D';
import VideoScene from './VideoScene';

export default class Scene {
    video: HTMLVideoElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    #renderOrder: number;

    backgroundScene: VideoScene;

    /* eslint @typescript-eslint/no-explicit-any: 0 */
    controls: any;
    initialisation: boolean;
    objects: Object3D[];

    constructor(video, debug) {
        this.video = video;
        this.initialisation = false;
        this.#renderOrder = 0;
        this.objects = [];
        console.log("Init Scene");

        this.backgroundScene = new VideoScene(video);

        const renderheight = globalThis.APPNamespace.height;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / renderheight, 0.1, 1000);
        // this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, .1, 1000);
        this.camera.position.z = renderheight;
        this.camera.lookAt(0, 0, 0);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);

        const light1 = new THREE.PointLight();
        light1.position.set(0.8, 1.4, renderheight + 5);
        this.scene.add(light1);

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, renderheight);
        document.body.appendChild(this.renderer.domElement);

        if (debug) {
            this.addControls();
            this.addGridHelper();
        }
        this.initialisation = true;
    }

    resize() {
        const ratio = window.innerWidth / this.video.videoWidth;
        const renderheight = ratio * this.video.videoHeight;

        globalThis.APPNamespace.height = renderheight;
        globalThis.APPNamespace.width = window.innerWidth;

        this.camera.aspect = window.innerWidth / renderheight;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, renderheight)
        this.renderer.render(this.scene, this.camera);
    }

    add3DObject(obj3D) {
        obj3D.obj.renderOrder = this.#renderOrder++;
        this.scene.add(obj3D.obj);
        this.objects.push(obj3D);
    }

    addControls() {
        const OrbitControls = oc(THREE);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 1, 0);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }

}