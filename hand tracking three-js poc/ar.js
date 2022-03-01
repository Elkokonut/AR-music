class Cube {
    constructor(color = 0x00ff00) {
        geometry = new THREE.BoxGeometry();
        material = new THREE.MeshBasicMaterial({ color: color });
        this.cube = new THREE.Mesh(geometry, material);
    }
}


class Scene {
    constructor(video) {
        scene = new THREE.Scene();
        scene.background = new THREE.VideoTexture(video);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1000;

        renderer = new THREE.WebGLRenderer(canvas = video, alpha = true);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }
    render() {
        requestAnimationFrame(this.render);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    add(elmt) {
        this.scene.add(elmt)
    }
}