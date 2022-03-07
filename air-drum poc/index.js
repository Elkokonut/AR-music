import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
// Uncomment the line below if you want to use TF.js runtime.
import '@tensorflow/tfjs-backend-webgl';
import {Howl} from 'howler';



var video = document.getElementById("videoElement");
var canvas = document.getElementById("output");
var ctx = canvas.getContext('2d');
ctx.translate(video.videoWidth, 0);
ctx.scale(-1, 1);

class Drum {
    constructor(x, y, height, width, sound_path) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.sound = new Howl({
            src: [sound_path],
            format: ['wav'],
            volume: 1,
        });
    }
    draw()
    {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    play()
    {
        if (this.sound.playing() == false)
        {
            this.sound.play();
        }
    }
}

// Needed to allow parcel to load audio files
let left_drum_path = require('url:./snare.wav');
let right_drum_path = require('url:./drum.wav');

var left_drum = new Drum(100, 200, 100, 100, left_drum_path);
var right_drum = new Drum(500, 200, 100, 100, right_drum_path);


if (navigator.mediaDevices.getUserMedia) {
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
    video.srcObject = stream;
    })
    .catch(function (error) {
    console.log("Something went wrong!", error);
    });
}

function drawImg(video)
{
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function drawKeypoint(keypoint)
{
    if (keypoint.score > 0.85)
    {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.fill(circle);
        ctx.stroke(circle);
    }
}

function drawDrums()
{
    left_drum.draw();
    right_drum.draw();
}

function isTouchingDrums(keypoint, drum)
{
    if (keypoint.name == "right_wrist" || keypoint.name == "left_wrist")
    {    
        console.log(keypoint);
        console.log(drum);
    }

    return (keypoint.x >= drum.x && keypoint.x <= drum.x + drum.width)
     && (keypoint.y >= drum.y && keypoint.y <= drum.y + drum.height)
}

async function app() {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'full'
    };
    var detector = await poseDetection.createDetector(model, detectorConfig);
    const webcam = await tf.data.webcam(video);

    while(true)
    {
        const img = await webcam.capture();
        //ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
        const poses = await detector.estimatePoses(img);
        drawImg(video);
        drawDrums();
        if(poses.length >= 1)
        {
            poses[0].keypoints.forEach(elm => {
                drawKeypoint(elm)
                if (isTouchingDrums(elm, left_drum))
                {
                    console.log("left !");
                    left_drum.play();
                }
                else if (isTouchingDrums(elm, right_drum))
                {
                    console.log("right !");
                    right_drum.play();
                }
            });
        }
        img.dispose();
        await tf.nextFrame();
    }
}
app();
