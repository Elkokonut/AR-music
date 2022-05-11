import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

export default class Classifier
{
    knn: knnClassifier.KNNClassifier;
    isLearning: boolean;
    current_label: number;
    enabled: boolean;

    constructor()
    {
        this.knn = knnClassifier.create();
        this.isLearning = false;
        this.current_label = 0;
        this.enabled = false;
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
        this.knn.predictClass(example)
    }

}