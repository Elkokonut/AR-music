import * as THREE from 'three';

export default class VideoScene {
    scene: THREE.Scene;
    camera: THREE.Camera;

    constructor(video) {
        const ratio = window.innerWidth / video.videoWidth;
        const renderheight = ratio * video.videoHeight;

        globalThis.APPNamespace.height = renderheight;
        globalThis.APPNamespace.width = window.innerWidth;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.VideoTexture(video);
        this.camera = new THREE.Camera();
    }
}