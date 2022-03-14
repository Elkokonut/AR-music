import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export default class poseDetector {
    constructor() {
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
    }

    async predictFrameKeypoints2d(video) {
        var img = tf.browser.fromPixels(video);
        const poses = await this.detector.estimatePoses(img, {}, Date.now());
        img.dispose();
        if (poses.length > 0) {
            return poses[0].keypoints;
        }
        else {
            return null;
        }
    }
}

