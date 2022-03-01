// class Cube {
//     constructor(color = 0x00ff00) {
//         geometry = new THREE.BoxGeometry();
//         material = new THREE.MeshBasicMaterial({ color: color });
//         this.cube = new THREE.Mesh(geometry, material);
//     }
// }


// class Scene {
//     constructor(video) {
//         scene = new THREE.Scene();
//         scene.background = new THREE.VideoTexture(video);

//         camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.z = 1000;

//         renderer = new THREE.WebGLRenderer(canvas = video, alpha = true);
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);

//         controls = new THREE.OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.25;
//         controls.enableZoom = true;

//         this.scene = scene;
//         this.camera = camera;
//         this.renderer = renderer;
//         this.controls = controls;
//     }
//     render() {
//         requestAnimationFrame(this.render);
//         this.controls.update();
//         this.renderer.render(this.scene, this.camera);
//     }
//     add(elmt) {
//         this.scene.add(elmt)
//     }


function createScene(video) {
    const scene = new THREE.Scene();
    scene.background = new THREE.VideoTexture(video);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const geometry = new THREE.BoxGeometry();
    const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const green_cube = new THREE.Mesh(geometry, green);
    green_cube.position.x = 2;
    green_cube.name = "leftHandCube"

    const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const red_cube = new THREE.Mesh(geometry, red);
    red_cube.position.x = -2;
    red_cube.name = "rightHandCube"

    scene.add(green_cube);
    scene.add(red_cube);


    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);

        green_cube.rotation.x += 0.01;
        green_cube.rotation.y += 0.01;
        red_cube.rotation.x += 0.02;
        red_cube.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    };

    return animate
}