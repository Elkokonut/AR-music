import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
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
        this.nb_calls = 0;
    }

    async init() {
        await tf.ready();
        console.log(`Backend is: ${tf.getBackend()}`);
        this.detector = await poseDetection.createDetector(this.model, this.detectorConfig);
        setInterval(() => {
            document.getElementById("frameRateAI").innerHTML = 'AI FrameRate: ' + this.nb_calls;
            this.nb_calls = 0;
        }
            , 1000);
    }

    async predictFrameKeypoints2d() {
        var img = tf.browser.fromPixels(this.video);
        this.nb_calls++;
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
        var img = tf.browser.fromPixels(this.video);
        this.nb_calls++;
        const poses = await this.detector.estimatePoses(img, {}, Date.now());
        img.dispose();
        if (poses.length > 0) {
            return poses[0].keypoints3D;
        }
        else {
            return null;
        }
    }
}

