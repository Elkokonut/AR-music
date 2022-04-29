import Keypoint from "./Keypoint";


export function generateKeypoints(keypoint_json) {
    const res = [];
    for (const [type, keypoints_info] of Object.entries(keypoint_json)) {
        const keypoints_names = keypoints_info[0];
        for (const index in keypoints_names)
            res.push(new Keypoint(type, index, keypoints_names[index]));
    }
    return res;
}