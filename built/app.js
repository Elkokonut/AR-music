var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BodyTrackerScene from './AR/scenes/BodyTrackerScene.js';
import poseDetector from './AI/holistic.js';
import enableInlineVideo from 'iphone-inline-video';
var webcam = true;
var video = document.querySelector('#webcam');
globalThis.APPNamespace = {};
enableInlineVideo(video);
video.style.display = "none";
if (webcam) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (localMediaStream) {
            return __awaiter(this, void 0, void 0, function* () {
                video.setAttribute('autoplay', 'autoplay');
                video.srcObject = localMediaStream;
            });
        })
            .catch(function (error) {
            console.log("Something went wrong!", error);
        });
    }
    else {
        console.log('Ce navigateur ne supporte pas la méthode getUserMedia');
    }
}
var initialisation = false;
video.addEventListener('canplay', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("canplay fired");
        if (!initialisation) {
            initialisation = true;
            yield initPage();
        }
        video.play();
    });
});
video.addEventListener('playing', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("playing fired");
        if (!initialisation) {
            initialisation = true;
            yield initPage();
        }
    });
});
video.addEventListener('pause', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pause fired");
        if (!initialisation) {
            initialisation = true;
            yield initPage();
        }
        video.play();
    });
});
function initPage() {
    return __awaiter(this, void 0, void 0, function* () {
        var scene = new BodyTrackerScene(video, true);
        yield scene.init();
        var promise = video.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.log("Create Button: " + error);
                // Auto-play was prevented
                // Show a UI element to let the user manually start playback
                createButton();
            }).then(() => {
                // Auto-play started
                console.log("Autoplay!");
            });
        }
        document.querySelector('canvas').setAttribute("style", ' -moz-transform: scale(-1, 1); \
                                          -webkit-transform: scale(-1, 1); \
                                          -o-transform: scale(-1, 1); \
                                          transform: scale(-1, 1); \
                                          filter: FlipH; \
                                          width: 100%; \
                                          max-width: 100%; \
                                          height: 100%;');
        var pose_detector = new poseDetector(video);
        yield pose_detector.init(scene);
    });
}
function createButton() {
    let btn = document.createElement("button");
    document.querySelector('canvas').style.display = "none";
    btn.innerHTML = "Start";
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
        video.play();
        document.querySelector('canvas').style.display = null;
        btn.style.display = "none";
    });
}
