declare function require(name: string);

import * as THREE from 'three'
import oc from 'three-orbit-controls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


const OrbitControls = oc(THREE);

/* Scene initialization */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x33CEA4);
scene.add(new THREE.AxesHelper(5))


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0.8, 1.4, 25);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

//const material = new THREE.MeshNormalMaterial()
/* ANCHOR 1 */
const light1 = new THREE.PointLight();
light1.position.set(0.8, 1.4, 30);
scene.add(light1);

const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
scene.add(ambientLight);

const material = new THREE.MeshPhongMaterial();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(geometry, material.clone());
mesh.material.color.set(0x0000ff);
mesh.material.colorWrite = false; // <================= new
mesh.renderOrder = 0;
mesh.position.z = 10;
scene.add(mesh);



const material3 = new THREE.MeshPhongMaterial({ color: 0x08ECA9 });
const geometry3 = new THREE.CircleGeometry(1, 32);
const circle = new THREE.Mesh(geometry3, material3);
circle.position.z = 4;
circle.renderOrder = 5;
circle.position.y = 5;
scene.add(circle);

const mesh2 = new THREE.Mesh(geometry.clone(), material.clone());
mesh2.material.color.set(0x0000ff);
mesh2.material.colorWrite = false; // <================= new
mesh2.renderOrder = 4;
mesh2.position.z = 10;
mesh2.position.y = 5;
scene.add(mesh2);

/* ANCHOR 2 */
const textureLoader = new THREE.TextureLoader();

const loader = new FBXLoader();
loader.load(
    require('../static/models/mic/microphone.fbx'),
    async (object) => {
        /* ANCHOR 3 */
        object.position.y = -8;
        const baseColorMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_BaseColor.png"));
        const metallicMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_Metalness.png"));
        const normalMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_Normal.png"));
        const roughnessMap = await textureLoader.load(require("../static/models/mic/textures/Microphone_FBX_Microphone_Roughness.png"));


        const micMaterial = new THREE.MeshStandardMaterial({
            map: baseColorMap,
            metalnessMap: metallicMap,
            normalMap: normalMap,
            roughnessMap: roughnessMap
        });

        for (const child of object.children) {
            child.material = micMaterial;
        }
        object = object.children[0];
        object.renderOrder = 1;
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()