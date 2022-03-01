import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
// Uncomment the line below if you want to use TF.js runtime.
import '@tensorflow/tfjs-backend-webgl';

export default class poseDetector
{
    constructor(video)
    {
        this.model = poseDetection.SupportedModels.BlazePose;
        const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full'
        };
        this.detector = await poseDetection.createDetector(model, detectorConfig);
        this.webcam = await tf.data.webcam(video);
    }

    predictFrameKeypoints2d()
    {
        const img = await this.webcam.capture();
        const poses = await this.detector.estimatePoses(img);
        img.dispose();
        return poses.keypoints;
    }
}

