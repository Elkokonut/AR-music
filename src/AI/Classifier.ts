import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

export default class Classifier
{
    knn: knnClassifier.KNNClassifier;
    isLearning: boolean;
    current_label: number;
    enabled: boolean;
    scene: any;
    prediction: number;

    constructor(scene)
    {
        this.scene = scene;
        this.knn = knnClassifier.create();
        this.isLearning = false;
        this.current_label = -1;
        this.enabled = false;
        this.prediction = -1;
    }
    
    createExample(results)
    {
        const example = tf.tensor(results.poseLandmarks.reduce(function (array, data_point) {
            array.push(data_point.x);
            array.push(data_point.y);
            array.push(data_point.visibility);
            return array;
          }, []));
          example.concat(tf.tensor(results.leftHandLandmarks.reduce(function (array, data_point) {
            array.push(data_point.x);
            array.push(data_point.y);
            array.push(data_point.visibility);
            return array;
          }, [])),
          0
          )
          example.concat(tf.tensor(results.rightHandLandmarks.reduce(function (array, data_point) {
            array.push(data_point.x);
            array.push(data_point.y);
            array.push(data_point.visibility);
            return array;
          }, [])),
          0
          )
        return example;
    }

    addExample(results)
    {
        const example = this.createExample(results);
        this.knn.addExample(example , this.current_label);
    }
    
    predict(results)
    {
        const example = this.createExample(results);

        const promise = this.knn.predictClass(example);
      if (promise !== undefined) {
      promise.catch((res) => this.prediction = res);
      }
    }

    call(keypoints)
    {
      if ((keypoints.poseLandmarks && keypoints.poseLandmarks.length > 0)
      && (keypoints.leftHandLandmarks && keypoints.leftHandLandmarks.length > 0)
      && (keypoints.rightHandLandmarks && keypoints.rightHandLandmarks.length > 0))
      {
        if (this.isLearning)
        {
          this.addExample(keypoints);
        }
        else
        {
          if (this.enabled)
          {
            this.predict(keypoints);
            console.log(this.prediction);
          }
        }
      }
    }
    
    startLearning(label) {
      this.isLearning = true;
      this.current_label = label;
    }

    stopLearning() {
      this.isLearning = false;
      this.current_label = -1;
    }

    enable()
    {
      this.enabled = true;
    }

    disable()
    {
      this.enabled = false;
      this.prediction = -1;
    }

}