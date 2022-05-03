
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const material = new MeshLineMaterial( {

    color: 0xffffff,
    lineWidth: 10, // in world units with size attenuation, pixels otherwise
    sizeAttenuation:1
} );

const vector1 = new THREE.Vector3( - 10, 0, 0 );

const points = [];
points.push( vector1);
points.push( new THREE.Vector3( 0, 10, 0 ) );

const line = new MeshLine();
line.setPoints(points);
line.material = material;
const mesh = new THREE.Mesh(line, material);

scene.add( mesh );
renderer.render( scene, camera );


// function animate() {
// 	requestAnimationFrame( animate );

//     // vector1.x +=1;
//     // vector1.y +=1;
//     // mesh.geometry.setPoints(points);
// 	renderer.render( scene, camera );
// }
// animate();
