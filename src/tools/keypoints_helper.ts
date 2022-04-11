import Distance from "./Distance";
import Keypoint from "./Keypoint";

export function initDistance(keypoint_json, scene_keypoints) {
    const res = {};
    for (const [type, keypoints_info] of Object.entries(keypoint_json))
    {
        const keypoints_names = keypoints_info[0];
        const keypoint_a = scene_keypoints.find(keypoint => keypoint.order == keypoints_names.indexOf(keypoints_info[1][0]) && keypoint.type == type);
        const keypoint_b = scene_keypoints.find(keypoint => keypoint.order == keypoints_names.indexOf(keypoints_info[1][1]) && keypoint.type == type);
        res[type] = new Distance(keypoint_a, keypoint_b, -0.99999999, 1, keypoints_info[2]["min"], keypoints_info[2]["max"]);
    }

    return res;

}

export function generateKeypoints(keypoint_json) {
    const res = [];
    for (const [type, keypoints_info] of Object.entries(keypoint_json))
    {
        const keypoints_names = keypoints_info[0];
        for (const index in keypoints_names)
            res.push(new Keypoint(type, index));
    }
    return res;
}