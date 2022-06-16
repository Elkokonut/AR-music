import * as knnClassifier from "@tensorflow-models/knn-classifier";
import * as tf from "@tensorflow/tfjs";
import Hand from "../Geometry/Hand";

export default class Classifier {
  knn: knnClassifier.KNNClassifier;
  isLearning: boolean;
  current_label: string;
  enabled: boolean;

  constructor() {
    this.knn = knnClassifier.create();
    this.isLearning = false;
    this.enabled = false;
    this.init();
  }

  init() {
    const example = tf.tensor(new Array(84).fill(-1));
    for (let index = 0; index < 1; index++) {
      this.knn.addExample(example, "");
    }
  }


  createExample(left_hand: Hand, right_hand: Hand) {

    const left_hand_kp = tf.tensor(left_hand.getKeypoints().reduce(function (array, kp) {
      array.push(kp.x);
      array.push(kp.y);
      return array;
    }, []));

    const right_hand_kp = tf.tensor(right_hand.getKeypoints().reduce(function (array, kp) {
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
    const prediction = await this.knn.predictClass(example, 60);
    // Because we increment the label starting from 0, label and prediction.classIndex should match.
    const returned_label = prediction.confidences[prediction.label] == 1 ? prediction.label : "";
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
