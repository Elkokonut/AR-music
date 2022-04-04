declare function require(name:string);

const keypoint_json = require("../../../ressources/keypoints.json");
import Scene from './Scene.js';
import Disk from "../objects/Disk.js"
import { initDistance, generateKeypoints } from "../../tools/keypoints_helper.js"
import Keypoint from '../../tools/Keypoint';
import Distance from '../../tools/Distance';


export default class BodyTrackerScene extends Scene {
    keypoints: Keypoint[];
    distances: { [key: string]: Distance };
    debug: boolean;

    constructor(video, debug) {
        super(video);
        this.keypoints = generateKeypoints(keypoint_json);
        this.distances = initDistance(keypoint_json, this.keypoints);

        this.debug =  debug;
    }


    async init() {
        super.init();

        if (this.debug)
            this.initDebug();
        this.animate();
    }

    initDebug() {
        this.keypoints.forEach(keypoint => {
            this.add3DObject(new Disk(keypoint));
        });
    }

    update_keypoints(new_keypoints) {

        this.keypoints.forEach(kp => {
            kp.update(new_keypoints);
        });
    }


    async animate() {

        let nb_calls_render = 0;

        setInterval(() => {
            document.getElementById("frameRateRender").innerHTML = 'Render FrameRate: ' + nb_calls_render;
            nb_calls_render = 0;
        }, 1000);

        /* eslint @typescript-eslint/no-this-alias: 0 */
        const self = this;

        async function render() {
            nb_calls_render++;
            self.objects.forEach(obj => {
                obj.animate(self.distances[obj.keypoint.type].getValue());
            });

            self.renderer.render(self.scene, self.camera);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}