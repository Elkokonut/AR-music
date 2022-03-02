import * as THREE from 'three';
import poseDetector from "./ia.js"

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

function change_position3d(cube, keypoint, width, height) {
    if (keypoint && keypoint.score > 0.85) {
        cube.visible = true;
        cube.position.x = keypoint.x * width;
        cube.position.y = - keypoint.y * height;
        cube.position.z = keypoint.z
    }
    else
        cube.visible = false
}


function change_position2d(cube, keypoint, width, height) {
    if (keypoint && keypoint.score > 0.85) {
        cube.visible = true;
        cube.position.x = (keypoint.x - width / 2) / 50;
        cube.position.y = - (keypoint.y - height / 2) / 50;
    }
    else
        cube.visible = false
}



export default async function createScene(video) {

    width = video.videoWidth;
    height = video.videoHeight;


    const scene = new THREE.Scene();
    scene.background = new THREE.VideoTexture(video);
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    console.log(`width is : ${width}`);
    console.log(`height is : ${height}`);

    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;

    const geometry = new THREE.BoxGeometry();
    const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const green_cube = new THREE.Mesh(geometry, green);

    green_cube.position.x = 2;
    green_cube.name = "leftHandCube"

    const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const red_cube = new THREE.Mesh(geometry, red);
    red_cube.position.x = -2;
    red_cube.name = "rightHandCube"

    const pose_detector = new poseDetector(video)
    await pose_detector.init()

    scene.add(green_cube);
    scene.add(red_cube);


    camera.position.z = width / 2 / 50;

    counter = 0

    async function animate() {
        requestAnimationFrame(animate);

        green_cube.rotation.x += 0.01;
        green_cube.rotation.y += 0.01;
        red_cube.rotation.x += 0.02;
        red_cube.rotation.y += 0.01;
        
        // if (counter % 24 == 0) {
            // mesh = await pose_detector.predictFrameKeypoints3d()
            mesh = await pose_detector.predictFrameKeypoints2d();
            if (mesh != null) {
                left_keypoint = mesh.find(keypoint => keypoint.name == "left_wrist")
                change_position2d(green_cube, left_keypoint, width, height)
                right_keypoint = mesh.find(keypoint => keypoint.name == "right_wrist")
                change_position2d(red_cube, right_keypoint, width, height)

                // left_keypoint = mesh.find(keypoint => keypoint.name == "left_wrist")
                // change_position3d(green_cube, left_keypoint, width, height)
                // right_keypoint = mesh.find(keypoint => keypoint.name == "right_wrist")
                // change_position3d(red_cube, right_keypoint, width, height)
            }
            else {
                green_cube.visible = false;
                red_cube.visible = false;
            }

        //     counter = 0;
        // }
        // else {
        //     counter++;
        // }
        renderer.render(scene, camera);
    };

    return animate
}