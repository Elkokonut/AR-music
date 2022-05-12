import * as knnClassifier from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";
import Hand from "../Geometry/Hand";

export default class Classifier {
  knn: knnClassifier.KNNClassifier;
  isLearning: boolean;
  current_label: number;
  enabled: boolean;
  pred_buffer: Array<number>;

  constructor() {
    this.pred_buffer = [];
    this.knn = knnClassifier.create();
    this.isLearning = false;
    this.current_label = -1;
    this.enabled = false;
  }


  createExample(left_hand: Hand, right_hand: Hand) {

    let left_hand_kp = tf.tensor(left_hand.getRelativeKeypoints().reduce(function (array, kp) {
      array.push(kp.x);
      array.push(kp.y);
      return array;
    }, []));

    let right_hand_kp = tf.tensor(right_hand.getRelativeKeypoints().reduce(function (array, kp) {
      array.push(kp.x);
      array.push(kp.y);
      return array;
    }, []));

    return left_hand_kp.concat(right_hand_kp, 0);
  }

  addExample(left_hand, right_hand) {
    const example = this.createExample(left_hand, right_hand);
    this.knn.addExample(example, this.current_label);
  }

  async predict(left_hand, right_hand) {
    const example = this.createExample(left_hand, right_hand);
    const prediction = await this.knn.predictClass(example, 30);
    // Because we increment the label starting from 0, label and prediction.classIndex should match.
    const returned_label = prediction.confidences[prediction.classIndex] == 1 ? parseInt(prediction.label) : -1;
    this.pred_buffer.unshift(...[returned_label]);
    if (this.pred_buffer.length == 11)
      this.pred_buffer.pop();
    return returned_label;
  }


  startLearning(label) {
    this.isLearning = true;
    this.current_label = label;
  }

  stopLearning() {
    this.isLearning = false;
    this.current_label = -1;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}
