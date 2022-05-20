import Occluser from "./Occluser";
import * as THREE from 'three';
import Keypoint from "../../../Geometry/Keypoint";


export default class Palm extends Occluser {
    vertices: Keypoint[];
    anchor: Keypoint;

    constructor(vertices, anchor) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const palm = new THREE.Mesh(geometry, material);

        super(palm, "");
        this.vertices = vertices;
        this.anchor = anchor;
    }


    animate(display) {
        const vertices = [
            this.vertices[0], this.vertices[1], this.vertices[2],
            this.vertices[0], this.vertices[2], this.vertices[3],
            this.vertices[2], this.vertices[1], this.vertices[0],
            this.vertices[3], this.vertices[2], this.vertices[0]
        ]
        const pts = new Float32Array(vertices.reduce(function (array, vertex) {
            array.push(vertex.position.x);
            array.push(vertex.position.y);
            array.push(vertex.position.z);
            return array;
        }, []));
        this.obj.geometry.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        super.animate(this.anchor.is_visible && display);
    }
}