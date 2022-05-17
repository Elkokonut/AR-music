import * as THREE from 'three';
import Distance from './Distance';
import Keypoint from "./Keypoint";


export default class Hand {
    type: string;
    keypoints: Keypoint[];
    distance: number;
    worldDistance: number;
    is_closed: boolean;
    bbox: THREE.Box3;

    constructor(keypoints) {
        if (keypoints && keypoints[0].name.includes("left"))
            this.type = "left";
        else
            this.type = "right";
        this.keypoints = keypoints;
        this.is_closed = false;
        this.distance = 0;

        this.bbox = new THREE.Box3();
    }

    refresh() {
        this.bbox.setFromPoints(this.keypoints.map(kp => kp.position));
        this.editDistance();
        this.isClosed();
    }

    editDistance() {
        const lines = [
            [
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_thumb_cmc`),
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_index_finger_mcp`)
            ],
            [
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_index_finger_mcp`),
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_pinky_finger_mcp`)
            ],
            [
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_pinky_finger_mcp`),
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_wrist`)
            ],
            [
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_wrist`),
                this.keypoints.find(keypoint => keypoint.name == `${this.type}_thumb_cmc`)
            ],
        ]
        const results = [];
        lines.forEach(tuple => {
            results.push(Distance.getWorldDistance(tuple[0].position, tuple[1].position));
        });

        this.worldDistance = Math.max(...results);
        this.distance = Distance.intervalChange(this.worldDistance, [0, 140], [-0.9999, 1]);
    }

    isClosed() {
        const d = Distance.getWorldDistance(
            this.keypoints.find(keypoint => keypoint.name == `${this.type}_wrist`).position,
            this.keypoints.find(keypoint => keypoint.name == `${this.type}_index_finger_tip`).position
        );

        const d2 = Distance.getWorldDistance(
            this.keypoints.find(keypoint => keypoint.name == `${this.type}_wrist`).position,
            this.keypoints.find(keypoint => keypoint.name == `${this.type}_pinky_finger_tip`).position
        );

        this.is_closed = d - 0.10 * this.worldDistance < this.worldDistance || d2 - 0.10 * this.worldDistance < this.worldDistance;
        return this.is_closed;
    }

    getRelativeKeypoints() {
        const width = globalThis.APPNamespace.width;
        const height = globalThis.APPNamespace.height;
        const wrist = this.keypoints.find(keypoint => keypoint.name == `${this.type}_wrist`).position;
        wrist.x = wrist.x / width;
        wrist.y = wrist.y / height;
        return this.keypoints.reduce((array, kp) => {
            const res = new THREE.Vector3(-1, -1, -1);
            kp.position.x = kp.position.x / width;
            kp.position.y = kp.position.y / height;
            if (kp.is_visible)
                res.subVectors(kp.position, wrist);
            array.push(res);
            return array;
        }, []);
    }
}