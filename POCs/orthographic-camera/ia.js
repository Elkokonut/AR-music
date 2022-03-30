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
            modelType: 'full'
        };
        this.detector;
        this.webcam;
    }

    async init() {
        this.detector = await poseDetection.createDetector(this.model, this.detectorConfig);
        this.webcam = await tf.data.webcam(this.video);
    }

    async predictFrameKeypoints2d() {
        const img = await this.webcam.capture();
        const poses = await this.detector.estimatePoses(img);
        img.dispose();
        if (poses.length > 0)
            return poses[0].keypoints;
        else
            return null;
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
}

