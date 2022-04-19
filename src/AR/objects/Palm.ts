import Occluser from "./Occluser";
import * as THREE from 'three';
import Keypoint from "../../tools/Keypoint";
import Distance from "../../tools/Distance";
import { MeshLine, MeshLineMaterial } from 'three.meshline';


export default class Palm extends Occluser {
    points: Keypoint[];
    anchor: Keypoint;

    constructor(points, anchor)
    {
        const geometry = new THREE.PlaneGeometry( 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const palm = new THREE.Mesh( geometry, material );

        super(palm, "");

        this.points = points;
        this.anchor = anchor;
    }


    animate() {
        this.obj.geometry.setPoints(this.points);
        this.obj.visible = this.anchor.is_visible;

        const distance = Distance.getDistance(this.points[0], this.points[1], [20, 60], [0.3, 1.3]);
        this.obj.material.lineWidth = 35 * distance;
        super.animate(null);
    }
}