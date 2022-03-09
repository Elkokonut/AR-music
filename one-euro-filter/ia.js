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
    }//return something like    
    // keypoints: [
    //     {x: 230, y: 220, score: 0.9, score: 0.99, name: "nose"},
    //     {x: 212, y: 190, score: 0.8, score: 0.91, name: "left_eye"},
    //     ...
    //   ]

    async predictFrameKeypoints3d() {
        const img = await this.webcam.capture();
        const poses = await this.detector.estimatePoses(img);
        img.dispose();
        if (poses.length > 0)
            return poses[0].keypoints3D;
        else
            return null;
    } // return something like     
    // keypoints3D: [
    //   {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "nose"},
    //   ...
    // ]

    // 0: nose
    // 1: left_eye_inner
    // 2: left
    // 3: left_eye_outer
    // 4: right_eye_inner
    // 5: right_eye
    // 6: right_eye_outer
    // 7: left_ear
    // 8: right_ear
    // 9: mouth_left
    // 10: mouth_right
    // 11: left_shoulder
    // 12: right_shoulder
    // 13: left_elbow
    // 14: right_elbow
    // 15: left_wrist
    // 16: right_wrist
    // 17: left_pinky
    // 18: right_pinky
    // 19: left_index
    // 20: right_index
    // 21: left_thumb
    // 22: right_thumb
    // 23: left_hip
    // 24: right_hip
    // 25: left_knee
    // 26: right_knee
    // 27: left_ankle
    // 28: right_ankle
    // 29: left_heel
    // 30: right_heel
    // 31: left_foot_index
    // 32: right_foot_index
}

