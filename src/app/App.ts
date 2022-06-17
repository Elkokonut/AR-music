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
  scene: BodyTrackerScene;

  constructor(debugMode) {
    this.video = document.querySelector('#webcam');
    this.debugMode = debugMode;
    this.initialisation = false;
    this.ui = new UI();
    this.ui.showLoading();

    enableInlineVideo(this.video);
    this.scene = null;

    this.initAI().then(async (pose_detector) => {
      this.video.addEventListener('loadedmetadata', () => {
        if (!this.initialisation) {
          console.log(this.video.videoHeight);
          this.initialisation = true;
          this.scene = this.initScene();
          pose_detector.start(this.scene);
        }
      });
    }).catch((err) => {
      this.ui.showErrorPage();
    });

  }

  async getStream(localMediaStream) {
    this.video.setAttribute('autoplay', 'autoplay');
    this.video.srcObject = localMediaStream;
  }


  async initAI() {
    const pose_detector = new PoseDetector(this.video);
    await pose_detector.init();
    return pose_detector;
  }

  initScene() {
    const scene = new BodyTrackerScene(this.video, this.debugMode);
    window.addEventListener("resize", () => scene.resize());
    const promise = this.video.play();
    if (promise !== undefined) {
      promise.catch(() => this.createButton()).then(() => console.log("Autoplay!"));
    }
    return scene;
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

