import BodyTrackerScene from '../AR/scenes/BodyTrackerScene';
import PoseDetector from '../AI/PoseDetector';
import enableInlineVideo from 'iphone-inline-video';
import { UI } from './Ui';
import Classifier from '../AI/Classifier';


export default class App {
  debugMode: boolean;
  video: HTMLVideoElement;
  initialisation: boolean;
  ui: UI;

  constructor(debugMode) {
    this.video = document.querySelector('#webcam');
    this.debugMode = debugMode;
    this.initialisation = false;
    this.ui = new UI();
    this.ui.showLoading();

    enableInlineVideo(this.video);
    this.video.style.display = "none";
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localMediaStream) => this.getStream(localMediaStream))
        .catch(function (error) {
          console.log("Something went wrong!", error);
        });
    }
    else {
      console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
    }

    this.video.addEventListener('canplay', () => this.callInitPage());
    this.video.addEventListener('playing', () => this.callInitPage());
    this.video.addEventListener('pause', () => this.callInitPage());
  }

  async getStream(localMediaStream) {
    this.video.setAttribute('autoplay', 'autoplay');
    this.video.srcObject = localMediaStream;
  }

  async callInitPage() {
    if (!this.initialisation) {
      this.initialisation = true;
      await this.initPage();
    }
  }

  async initPage() {
    const scene = new BodyTrackerScene(this.video, this.debugMode);
    window.addEventListener("resize", () => scene.resize());
    const promise = this.video.play();
    if (promise !== undefined) {
      promise.catch(() => this.createButton()).then(() => console.log("Autoplay!"));
    }

    globalThis.APPNamespace.Classifier = new Classifier();

    const pose_detector = new PoseDetector(this.video);
    await pose_detector.init(scene);
  }

  createButton() {
    const btn = document.createElement("button");
    document.querySelector('canvas').style.display = "none";
    btn.innerHTML = "Start";
    document.body.appendChild(btn);
    this.ui.hideLoading();
    const video = this.video;
    btn.addEventListener('click', () => function () {
      video.play();
      document.querySelector('canvas').style.display = null;
      btn.style.display = "none";
    }());
  }
}

