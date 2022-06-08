import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import enableInlineVideo from 'iphone-inline-video';
import Frame, { FrameType } from "./Frame";
import Interface from "./Interface";
import MeshText from "./MeshText";

declare function require(name: string);

export default class FrameFactory {

    static generateAllFrames(scene: BodyTrackerScene, front: Interface) {
        const frames: Frame[] = [];

        frames.push(FrameFactory.startingFrame(front)); // "starting_frame"
        frames.push(FrameFactory.mainFrame(scene, front)); // "main"
        frames.push(FrameFactory.autoInfoFrame(front));
        frames.push(...FrameFactory.generateBigCounters());
        frames.push(...FrameFactory.generateSmallCounters(10));
        frames.push(FrameFactory.trainMic(scene, front)); // "training_mic"
        frames.push(FrameFactory.trainDrums(scene, front)); // "training_drums"
        frames.push(FrameFactory.infoTrainingFrame(front)); // "training_info"
        frames.push(FrameFactory.trainingMainPanel(scene, front)); // "training_mail_panel"
        frames.push(FrameFactory.clearTraining(scene, front)); // "training_clear"
        return frames;
    }

    // #region generic;

    static basicChildFrame(localHeight, localWidth, column = false) {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;
        return new Frame(
            new ThreeMeshUI.Block(
                {
                    height: height * localHeight,
                    width: width * localWidth,
                    justifyContent: 'center',
                    contentDirection: column ? 'column' : 'row',
                    backgroundColor: new THREE.Color(0xba2f8e),
                    backgroundOpacity: 0,
                    offset: 0.05,

                })
            , FrameType.ChildFrame,
            (frame) => { Frame.basicResize(frame, localWidth) }
        );
    }

    static backButton(front: Interface, localHeight, localWidth) {
        return new Button(localHeight, localWidth, "Back to menu",
            () => { front.next(FrameType.Main); },
            false,
            null,
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 0.9
            },
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 0.7
            },
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 1
            }
        );
    }


    private static learningProcess(front, scene, label, onBefore, onAfter) {
        if (label == "microphone" || label == "drums")
            scene.factory.change_instrument(label, scene);
        else
            scene.factory.change_instrument("", scene);
        front.next(FrameType.Big3);
        setTimeout(() => {
            front.next(FrameType.Big2);
        }, 1000);
        setTimeout(() => {
            front.next(FrameType.Big1);
        }, 2000);
        setTimeout(() => {
            scene.classifier.startLearning(label);
            scene.classifier.disable();
            front.next(FrameType.GO);
            if (onBefore)
                onBefore();
        }, 3000);
        setTimeout(() => {
            front.next(FrameType.SmallCounter);
            for (let i = 1; i < 10; i++) {
                setTimeout(() => {
                    front.next(FrameType.SmallCounter);
                }, 1000 * i);
            }
        }, 4000);
        setTimeout(() => {
            scene.classifier.stopLearning();
            scene.factory.change_instrument("", scene);
            if (onAfter)
                onAfter();
        }, 14000);
    }

    private static content_button_frame(type: FrameType, content, action, button_text = "Next") {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;

        const frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.7,
                width: width * 0.7,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x47ada1),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                textAlign: 'center',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),

            }),
            type,
            (frame) => { Frame.basicResize(frame, 0.7) }
        );

        const frame2 = FrameFactory.basicChildFrame(0.5, 0.6);

        frame.addElement(frame2);
        frame2.addElement(new MeshText(content, 0.03));

        frame.addElement(new Button(0.10, 0.10, button_text, action));
        return frame;
    }

    private static content_video_button_frame(type: FrameType, content, videoPath, action, button_text = "Next") {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;

        const frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.7,
                width: width * 0.8,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x47ada1),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                textAlign: 'center',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),

            }),
            type,
            (frame) => { Frame.basicResize(frame, 0.8) }
        );

        const frame2 = FrameFactory.basicChildFrame(0.5, 0.7);

        const text_frame = FrameFactory.basicChildFrame(0.5, 0.3);

        const video = document.createElement("video");
        video.setAttribute("src", videoPath);
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.load();
        enableInlineVideo(video);
        video.play();

        video.addEventListener("loadedmetadata", function () {
            const video_frame = new Frame(
                new ThreeMeshUI.Block(
                    {
                        height: height * 0.5,
                        width: width * 0.4,
                        justifyContent: 'center',
                        margin: 0.5,
                        backgroundTexture: new THREE.VideoTexture(video),
                        backgroundOpacity: 1,
                        backgroundSize: 'stretch',
                        offset: 0.05,

                    })
                , FrameType.ChildFrame,
                (frame) => { Frame.resizeWithRatio(frame, 0.4, 0.5, video.videoHeight / video.videoWidth) }
            );

            frame.addElement(frame2);
            frame2.addElement(text_frame);
            frame2.addElement(video_frame);
            text_frame.addElement(new MeshText(content, 0.03));
            frame.addElement(new Button(0.10, 0.10, button_text, action));
            frame.resize();

        }, false);



        return frame;
    }


    private static yes_no_frame(type: FrameType, content, action1, action2, button_text1 = "No", button_text2 = "Yes") {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;

        const frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.7,
                width: width * 0.7,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x47ada1),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),

            }),
            type,
            (frame) => Frame.basicResize(frame, 0.7)
        );

        const frame2 = FrameFactory.basicChildFrame(0.5, 0.6);

        frame.addElement(frame2);
        frame2.addElement(new MeshText(content, 0.04));

        const frame3 = FrameFactory.basicChildFrame(0.2, 0.6);
        frame.addElement(frame3);

        frame3.addElement(new Button(0.15, 0.15, button_text2, action2));
        frame3.addElement(new Button(0.15, 0.15, button_text1, action1));

        return frame;

    }



    private static text_frame(type: FrameType, content) {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;


        const frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.7,
                width: width * 0.7,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x2d8a85),
                backgroundOpacity: 0,
                justifyContent: 'center',
                contentDirection: 'column',
                fontColor: new THREE.Color(0xa7ebe7),
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),

            }),
            type,
            (frame) => Frame.basicResize(frame, 0.7)
        );

        frame.addElement(new MeshText(content, 0.04));
        return frame;
    }


    //#endregion

    static startingFrame(front: Interface) {
        const text_intro = "Welcome! \nPlease use headphones.\n Interact with the interface using your indexes.";

        return FrameFactory.content_video_button_frame(FrameType.StartingFrame, text_intro, "/videos_demo/startingInfo.mp4", function () {
            console.log("Next");
            front.next(FrameType.Main);
        });
    }

    static mainFrame(scene: BodyTrackerScene, front: Interface) {
        const contentDir = globalThis.APPNamespace.mobileCheck() ? "column" : "row";

        const button_width = globalThis.APPNamespace.mobileCheck() ? 0.25 : 0.1;
        const button_height = 0.1;
        const frame = new Frame(new ThreeMeshUI.Block({
            borderRadius: 1,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.4,
            justifyContent: 'center',
            contentDirection: contentDir,
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png'),

        }), FrameType.Main,
            function resize(frame: Frame) {
                const localHeight = Frame.distance;
                const localRatio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
                const localWidth = localHeight / localRatio;
                const button_size = button_height * Math.min(localHeight, localWidth);
                const margin_size = Math.min(localHeight, localWidth) * button_height / 10;
                const panel_height = button_size + 2 * margin_size;

                if (globalThis.APPNamespace.mobileCheck())
                    frame.obj.position.setX(0).setY((localHeight - 3.5) / 2 - panel_height);
                else
                    frame.obj.position.setX(0).setY((localHeight - 3.5) / 2 - panel_height / 2);
            }
        );

        const btns_list = [
            new Button(button_width, button_height, "No instrument",
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("", scene);
                }
            ),
            new Button(button_width, button_height, "Mic",
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("microphone", scene);
                }
            ),
            new Button(button_width, button_height, "Drums",
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("drums", scene);
                }
            ),
            new Button(button_width, button_height, "Auto",
                function () {
                    scene.factory.change_instrument("", scene);
                    if (scene.classifier.knn.getNumClasses() <= 1) {
                        front.next(FrameType.AutoInfo);
                    }
                    else {
                        scene.classifier.stopLearning();
                        scene.classifier.enable();
                        console.log("Now using the trained KNN !");
                    }
                }
            ),
            new Button(button_width, button_height, "AI Training",
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    scene.factory.change_instrument("", scene);
                    if (scene.classifier.knn.getNumClasses() <= 1) {
                        front.next(FrameType.TrainingMic);
                    }
                    else {
                        front.next(FrameType.TrainingMainPanel);
                    }
                }
            ),
            new Button(button_width, button_height, "Reset Training",
                function () {
                    scene.classifier.disable();
                    scene.factory.change_instrument("", scene);
                    front.next(FrameType.ClearTraining);
                }
            )
        ]

        if (globalThis.APPNamespace.mobileCheck() == true) {
            const top_sub_frame = new Frame(new ThreeMeshUI.Block({
                borderRadius: 1,
                backgroundColor: new THREE.Color(0xfffff),
                backgroundOpacity: 0,
                justifyContent: 'center',
                contentDirection: "row",
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),
                offset: 0.05
            }), FrameType.ChildFrame,
                (frame) => { Frame.basicResize(frame, 1) }
            );

            const bottom_sub_frame = new Frame(new ThreeMeshUI.Block({
                borderRadius: 1,
                backgroundColor: new THREE.Color(0xfffff),
                backgroundOpacity: 0,
                justifyContent: 'center',
                contentDirection: "row",
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),
                offset: 0.05
            }), FrameType.ChildFrame,
                (frame) => { Frame.basicResize(frame, 1) }
            );

            frame.addElement(top_sub_frame);
            frame.addElement(bottom_sub_frame);

            top_sub_frame.addElement(btns_list[0]);
            top_sub_frame.addElement(btns_list[1]);
            top_sub_frame.addElement(btns_list[2]);
            bottom_sub_frame.addElement(btns_list[3]);
            bottom_sub_frame.addElement(btns_list[4]);
            bottom_sub_frame.addElement(btns_list[5]);
        }
        else {
            btns_list.forEach(btn => frame.addElement(btn));
        }


        return frame;
    }

    static autoInfoFrame(front: Interface) {
        const text_info = "To use Auto Mode,\n please train the AI by pressing 'AI Training'.";

        return FrameFactory.content_button_frame(FrameType.AutoInfo, text_info, function () {
            front.next(FrameType.Main);
        }, "Got it!");
    }


    static trainingMainPanel(scene: BodyTrackerScene, front: Interface) {
        // TODO : Add "Back" Button

        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;


        const frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.85,
                width: width * 0.85,
                fontSize: 100 / height,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x6abdb3),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png'),

            }),
            FrameType.TrainingMainPanel,
            (frame) => Frame.basicResize(frame, 0.85)
        );

        const top_frame = FrameFactory.basicChildFrame(0.2, 0.7);
        const back_button = FrameFactory.backButton(front, 0.1, 0.1);
        const text_frame = FrameFactory.basicChildFrame(0.2, 0.5);
        const filler_frame = FrameFactory.basicChildFrame(0.2, 0.05);

        const text = "Training is about to start \n Pick an action to learn"

        frame.addElement(top_frame);
        text_frame.addElement(new MeshText(text, 0.04));
        top_frame.addElement(back_button);
        top_frame.addElement(text_frame);
        top_frame.addElement(filler_frame);


        const button_frame = FrameFactory.basicChildFrame(0.6, 0.8);
        const left_button_frame = FrameFactory.basicChildFrame(0.6, 0.4, true);
        const right_button_frame = FrameFactory.basicChildFrame(0.6, 0.4, true);
        frame.addElement(button_frame);
        button_frame.addElement(left_button_frame);
        button_frame.addElement(right_button_frame);


        FrameFactory.buttonPack(left_button_frame, "Mic", "microphone", scene, front);
        FrameFactory.buttonPack(left_button_frame, "Drums", "drums", scene, front);
        FrameFactory.buttonPack(left_button_frame, "Harp", "harp", scene, front);
        FrameFactory.buttonPack(left_button_frame, "Guitar", "guitar", scene, front);
        FrameFactory.buttonPack(left_button_frame, "Kalimba", "kalimba", scene, front);
        FrameFactory.buttonPack(right_button_frame, "Violon", "violon", scene, front);
        FrameFactory.buttonPack(right_button_frame, "Trombone", "trombone", scene, front);
        FrameFactory.buttonPack(right_button_frame, "Voice", "voice", scene, front);
        FrameFactory.buttonPack(right_button_frame, "Xylo", "xylo", scene, front);
        FrameFactory.buttonPack(right_button_frame, "Synth Dive", "synth_dive", scene, front);


        frame.addElement(FrameFactory.basicChildFrame(0.05, 0.8));

        return frame;
    }


    static buttonPack(frame, btn_label, label, scene, front) {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;


        const btn_block_options = {
            height: height * 0.1,
            width: width * 0.4,
            justifyContent: 'center',
            contentDirection: 'row',
            borderRadius: 10,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0,
            offset: 0.05,
            margin: 0.5,

        };

        const button_block = new Frame(new ThreeMeshUI.Block(btn_block_options), FrameType.ChildFrame,
            (frame) => Frame.basicResize(frame, 0.4));
        frame.addElement(button_block);
        const btn = new Button(0.33, 0.1, btn_label,
            () => FrameFactory.learningProcess(front,
                scene,
                label,
                null,
                () => front.next(FrameType.Main)
            )
        );
        btn.label.fontSizeRatio = 0.02;
        button_block.addElement(btn);

        const del_btn = new Button(0.05, 0.1, "X",
            () => {
                FrameFactory.pendingSoundDeletion(label, scene, front);
            },
            false,
            null,
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 0.9
            },
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 0.7
            },
            {
                backgroundColor: new THREE.Color(0x940d26),
                backgroundOpacity: 1
            }
        );

        del_btn.marginRatio = 0;

        button_block.addElement(del_btn);

    }

    static pendingSoundDeletion(label, scene, front: Interface) {

        const content = `Are you sure you want to delete all\
         \ninformation registered as "${label}" ? \
        \n You will still be able to register it again later.`

        const frame = FrameFactory.yes_no_frame(
            FrameType.DeleteLabel, content, null, null, "No", "Yes"
        );
        frame.resize();

        const fcnt0 = () => {
            scene.classifier.removeLabel(label);
            front.removeChild(frame, scene);
            front.next(FrameType.Main);
        }

        const fcnt1 = () => {
            front.removeChild(frame, scene);
            front.next(FrameType.TrainingMainPanel);
        }

        const sub_btn_frame = frame.children[1];

        if (sub_btn_frame instanceof Frame) {
            if (sub_btn_frame.children[0] instanceof Button) {
                sub_btn_frame.children[0].action = fcnt0;
            }
            if (sub_btn_frame.children[1] instanceof Button) {
                sub_btn_frame.children[1].action = fcnt1;
            }
        }
        front.addChild(frame, scene);
        front.next(FrameType.DeleteLabel);
    }


    static trainMic(scene, front: Interface) {
        const text_frame = "Mimick singing in a mic to train AI";

        const frame = FrameFactory.content_video_button_frame(
            FrameType.TrainingMic,
            text_frame,
            "videos_demo/playing_mic.mp4",
            function () {
                FrameFactory.learningProcess(
                    front,
                    scene,
                    "microphone",
                    null,
                    () => front.next(FrameType.TrainingDrum))
            },
            "Start");

        frame.onBefore = () => { scene.factory.change_instrument("microphone", scene) };

        return frame;
    }


    static trainDrums(scene, front: Interface) {
        const text_frame = "Mimick playing the drum to train AI";

        const frame = FrameFactory.content_video_button_frame(FrameType.TrainingDrum,
            text_frame,
            "videos_demo/playing_drums.mp4",
            function () {
                FrameFactory.learningProcess(
                    front,
                    scene,
                    "drums",
                    null,
                    () => front.next(FrameType.TrainingInfo))
            },
            "Start");

        frame.onBefore = () => { scene.factory.change_instrument("drums", scene); }

        return frame;
    }

    static generateBigCounters() {
        const frames = []
        frames.push(FrameFactory.text_frame(FrameType.Big1, "1"));
        frames.push(FrameFactory.text_frame(FrameType.Big2, "2"));
        frames.push(FrameFactory.text_frame(FrameType.Big3, "3"));
        frames.push(FrameFactory.text_frame(FrameType.GO, "GO!"));

        return frames;
    }

    static infoTrainingFrame(front: Interface) {
        const text_frame = "You can add new instruments or improve the detection by clicking \non 'AI training' again.\n Click on 'Auto' to try the AI."
        return FrameFactory.content_button_frame(FrameType.TrainingInfo, text_frame, function () {
            front.next(FrameType.Main);
        }, "Got it!");
    }

    static clearTraining(scene, front: Interface) {
        const content = "Are you sure you want to delete all data from the AI ?"

        return FrameFactory.yes_no_frame(FrameType.ClearTraining,
            content, () => {
                front.next(FrameType.Main);
            },
            () => {
                scene.classifier.removeAllLabels();
                front.next(FrameType.Main);
            },
            "No",
            "Yes"
        )
    }

    static generateSmallCounters(number) {

        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;
        const frames = [];
        for (let i: number = number; i > 0; i--) {

            const frame = new Frame(new ThreeMeshUI.Block(
                {
                    height: height * 0.7,
                    width: width * 0.7,
                    padding: 0.5,
                    margin: 0.5,
                    borderRadius: 10,
                    backgroundColor: new THREE.Color(0x2d8a85),
                    backgroundOpacity: 0,
                    justifyContent: 'start',
                    contentDirection: 'column-reverse',
                    fontColor: new THREE.Color(0xa7ebe7),
                    fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                    fontTexture: require('../../../../static/fonts/gothic.png'),
                }),
                FrameType.SmallCounter,
                (frame) => Frame.basicResize(frame, 0.7)
            );
            frame.addElement(new MeshText(`${i}`, 0.04));
            frames.push(frame);
        }
        return frames;
    }
}