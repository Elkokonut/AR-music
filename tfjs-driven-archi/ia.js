import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';

export default class poseDetector {
    constructor(video) {
        this.video = video;
        this.model = poseDetection.SupportedModels.BlazePose;
        this.detectorConfig = {
            runtime: 'tfjs',
            enableSmoothing: true,
            modelType: 'lite'
        };
        this.detector;
        this.webcam;
    }

    async init() {
        await tf.ready();
        console.log(`Backend is: ${tf.getBackend()}`);
        this.detector = await poseDetection.createDetector(this.model, this.detectorConfig);
        this.webcam = await tf.data.webcam(this.video);
    }

    async predictFrameKeypoints2d() {
        const img = await this.webcam.capture();
        const poses = await this.detector.estimatePoses(img, {}, Date.now());
        img.dispose();
        if (poses.length > 0) {
            return poses[0].keypoints;
        }
        else {
            return null;
        }
    }

    async predictFrameKeypoints3d() {
        const img = await this.webcam.capture();
        const poses = await this.detector.estimatePoses(img);
        img.dispose();
        if (poses.length > 0)
            return poses[0].keypoints3D;
        else
            return null;
    }

    async mainLoop(scene)
    {
        var nb_called = 0;
        var intervall_sec = setInterval(() => {
            console.log(nb_called);
            nb_called = 0;
        }, 1000)
        while(true)
        {
            var keypoints = await this.predictFrameKeypoints2d();
            nb_called++;
            if (keypoints !== null)
                scene.render_scene(keypoints);
            await tf.nextFrame();
        }
    }
}

