var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var keypoint_json = require("../../../ressources/keypoints.json");
import Scene from './Scene.js';
import Disk from "../objects/Disk.js";
import { initDistance, generateKeypoints } from "../../tools/keypoints_helper.js";
export default class BodyTrackerScene extends Scene {
    constructor(video, debug) {
        super(video);
        this.keypoints = generateKeypoints(keypoint_json);
        this.distances = initDistance(keypoint_json, this.keypoints);
        this.debug = true;
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.init.call(this);
            if (this.debug)
                this.initDebug();
            this.animate();
        });
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
    animate() {
        return __awaiter(this, void 0, void 0, function* () {
            var nb_calls_render = 0;
            setInterval(() => {
                document.getElementById("frameRateRender").innerHTML = 'Render FrameRate: ' + nb_calls_render;
                nb_calls_render = 0;
            }, 1000);
            var self = this;
            function render() {
                return __awaiter(this, void 0, void 0, function* () {
                    nb_calls_render++;
                    self.objects.forEach(obj => {
                        obj.animate(self.distances[obj.keypoint.type].getValue());
                    });
                    self.renderer.render(self.scene, self.camera);
                    requestAnimationFrame(render);
                });
            }
            requestAnimationFrame(render);
        });
    }
}
