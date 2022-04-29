import Occluser from "./Occluser";
import * as THREE from 'three';
import Keypoint from "../../../Geometry/Keypoint";
import Distance from "../../../Geometry/Distance";
import { MeshLine, MeshLineMaterial } from 'three.meshline';


export default class Phalanx extends Occluser {
    points: Keypoint[];
    anchor: Keypoint;

    constructor(points, anchor)
    {
        const material = new MeshLineMaterial( {

            color: 0x00ffff,
            lineWidth: 35, // in world units with size attenuation, pixels otherwise
        } );

        const line = new MeshLine();
        line.setPoints(points);
        line.material = material;
        const mesh = new THREE.Mesh(line, material);

        super(mesh, ""); 

        this.points = points;
        this.anchor = anchor;
    }


    animate(display) {
        this.obj.geometry.setPoints(this.points);
        this.obj.visible = this.anchor.is_visible;

        const size = Distance.getDistance(this.points[0], this.points[1], [20, 60], [0.3, 1.3]);
        this.obj.material.lineWidth = 35 * size;
        super.animate(display);
    }
}