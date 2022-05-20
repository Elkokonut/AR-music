import * as knnClassifier from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";
import Hand from "../Geometry/Hand";

export default class Classifier {
  knn: knnClassifier.KNNClassifier;
  isLearning: boolean;
  current_label: string;
  enabled: boolean;
  pred_buffer: Array<string>;

  constructor() {
    this.pred_buffer = [];
    this.knn = knnClassifier.create();
    this.isLearning = false;
    this.enabled = false;
    this.init();
  }

  init() {
    const example = tf.tensor(new Array(84).fill(-1));
    for (let index = 0; index < 600; index++) {
      this.knn.addExample(example, "");
    }
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

    if (this.knn.getNumClasses() <= 0)
      return "";
    const example = this.createExample(left_hand, right_hand);
    const prediction = await this.knn.predictClass(example, 30);
    // Because we increment the label starting from 0, label and prediction.classIndex should match.
    const returned_label = prediction.confidences[prediction.label] == 1 ? prediction.label : "";
    this.pred_buffer.unshift(...[returned_label]);
    if (this.pred_buffer.length == 8)
      this.pred_buffer.pop();
    return returned_label;
  }

  removeLabel(label) {
    if (label in this.knn.getClassExampleCount())
      this.knn.clearClass(label);
  }

  removeAllLabels() {
    this.knn.clearAllClasses();
    this.init();
  }

  startLearning(label: string) {
    this.isLearning = true;
    this.current_label = label;
  }

  stopLearning() {
    this.isLearning = false;
    this.current_label = "";
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}
