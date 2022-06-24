import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import enableInlineVideo from 'iphone-inline-video';
import Frame, { FrameType } from "./Frame";
import Interface from "./Interface";
import MeshText from "./MeshText";
declare function require(name: string);
const interface_json = require("../../../../static/json/interface.json");

export default class FrameFactory {

    static generateAllFrames(scene: BodyTrackerScene, front: Interface) {
        const frames: Frame[] = [];

        frames.push(FrameFactory.startingFrame(front)); // "starting_frame"
        frames.push(FrameFactory.appInstructionsFrame(front));
        frames.push(...FrameFactory.tutorial(front));
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
        front.next(FrameType.Ready);
        setTimeout(() => {
            front.next(FrameType.Set);
        }, 1000);
        setTimeout(() => {
            scene.classifier.startLearning(label);
            scene.classifier.disable();
            front.next(FrameType.GO);
            if (onBefore)
                onBefore();
        }, 2000);
        setTimeout(() => {
            front.next(FrameType.SmallCounter);
            for (let i = 1; i < 10; i++) {
                setTimeout(() => {
                    if (label != "microphone" && label != "drums")
                        scene.soundManager.playSound(label);
                    front.next(FrameType.SmallCounter);
                }, 1000 * i);
            }
        }, 3000);
        setTimeout(() => {
            scene.classifier.stopLearning();
            scene.factory.change_instrument("", scene);
            if (onAfter)
                onAfter();
        }, 13000);
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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',

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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',

            }),
            type,
            (frame) => { Frame.basicResize(frame, 0.8) }
        );

        const frame2 = FrameFactory.basicChildFrame(0.5, 0.7);
        const text_frame = FrameFactory.basicChildFrame(0.5, 0.3);
        let call = false;
        frame.addOnBefore(() => {

            if (call == false) {
                call = true;

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
                    frame.addOnDelete(() => {
                        video.pause();
                        video.removeAttribute('src'); // empty source
                        video.load();
                    });
                    frame.resize();
                }, false);
            }
        });



        return frame;
    }


    private static yes_no_frame(type: FrameType, content, action1, action2, button_text1 = "No", button_text2 = "Yes") {
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
                contentDirection: 'column',
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',

            }),
            type,
            (frame) => Frame.basicResize(frame, 0.7)
        );

        const frame2 = FrameFactory.basicChildFrame(0.5, 0.6);

        frame.addElement(frame2);
        frame2.addElement(new MeshText(content, 0.03));

        const frame3 = FrameFactory.basicChildFrame(0.2, 0.6);
        frame.addElement(frame3);

        frame3.addElement(new Button(0.1, 0.1, button_text2, action2));
        frame3.addElement(new Button(0.1, 0.1, button_text1, action1));

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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',

            }),
            type,
            (frame) => Frame.basicResize(frame, 0.7)
        );

        frame.addElement(new MeshText(content, 0.04));
        return frame;
    }


    //#endregion

    static startingFrame(front: Interface) {
        const text_intro = interface_json["content"]["starting_frame"];

        return FrameFactory.content_video_button_frame(FrameType.StartingFrame, text_intro, "/videos_demo/startingInfo.mp4", function () {
            front.next(FrameType.AppInstructions);
        });
    }

    static mainFrame(scene: BodyTrackerScene, front: Interface) {
        const contentDir = globalThis.APPNamespace.mobileCheck() ? "column" : "row";

        const button_width = globalThis.APPNamespace.mobileCheck() ? 0.25 : 0.15;
        const button_height = 0.1;
        const frame = new Frame(new ThreeMeshUI.Block({
            borderRadius: 1,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.4,
            justifyContent: 'center',
            contentDirection: contentDir,
            fontFamily: 'fonts/gothic-msdf.json',
            fontTexture: 'fonts/gothic.png',
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
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["no_inst"],
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("", scene);
                }
            ),
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["mic"],
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("microphone", scene);
                }
            ),
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["drums"],
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    globalThis.APPNamespace.modeAuto = false;
                    scene.factory.change_instrument("drums", scene);
                }
            ),
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["auto_mode"],
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
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["teach_gestures"],
                function () {
                    scene.classifier.stopLearning();
                    scene.classifier.disable();
                    scene.factory.change_instrument("", scene);
                    if (scene.classifier.knn.getNumClasses() <= 1) {
                        if (scene.classifier.knn.getClassExampleCount())
                            if (!scene.classifier.knn.getClassExampleCount()["drums"])
                                front.next(FrameType.TrainingDrum);
                            else
                                front.next(FrameType.TrainingMic);
                        else
                            front.next(FrameType.TrainingDrum);
                    }
                    else {
                        front.next(FrameType.TrainingMainPanel);
                    }
                }
            ),
            new Button(button_width, button_height, interface_json["labels"]["main_panel_buttons"]["reset_gestures"],
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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',
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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',
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
        const text_info = interface_json["content"]["auto_info_frame"];

        return FrameFactory.content_button_frame(FrameType.AutoInfo, text_info, function () {
            front.next(FrameType.Main);
        }, "Got it!");
    }


    static trainingMainPanel(scene: BodyTrackerScene, front: Interface) {
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
                fontFamily: 'fonts/gothic-msdf.json',
                fontTexture: 'fonts/gothic.png',

            }),
            FrameType.TrainingMainPanel,
            (frame) => Frame.basicResize(frame, 0.85)
        );
        const map_content_label: Map<string, string> = new Map();
        map_content_label.set('Mic', "microphone");
        map_content_label.set("Drums", "drums");
        map_content_label.set("Harp", "harp");
        map_content_label.set("Guitar", "guitar");
        map_content_label.set("Kalimba", "kalimba");
        map_content_label.set("Violon", "violon");
        map_content_label.set("Trombone", "trombone");
        map_content_label.set("Voice", "voice");
        map_content_label.set("Xylo", "xylo");
        map_content_label.set("Synth Dive", "synth_dive");



        frame.addOnBefore(() => {
            const btns_panel = frame.children[1];
            if (btns_panel instanceof Frame) {
                btns_panel.children.forEach(panel => {
                    if (panel instanceof Frame) {
                        panel.children.forEach(btn_duo => {
                            if (btn_duo instanceof Frame) {
                                const trainBtn = btn_duo.children[0];
                                const delBtn = btn_duo.children[1];
                                if (trainBtn instanceof Button && delBtn instanceof Button) {
                                    const label = map_content_label.get(trainBtn.content);
                                    if (label in scene.classifier.knn.getClassExampleCount()) {
                                        trainBtn.disableButton();
                                        delBtn.enableButton();
                                    }
                                    else {
                                        trainBtn.enableButton();
                                        delBtn.disableButton();
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });


        const top_frame = FrameFactory.basicChildFrame(0.2, 0.7);
        const back_button = FrameFactory.backButton(front, 0.1, 0.1);
        const text_frame = FrameFactory.basicChildFrame(0.2, 0.5);
        const filler_frame = FrameFactory.basicChildFrame(0.2, 0.05);

        const text = interface_json["content"]["training_main_panel"];

        frame.addElement(top_frame);
        text_frame.addElement(new MeshText(text, 0.02));
        top_frame.addElement(back_button);
        top_frame.addElement(text_frame);
        top_frame.addElement(filler_frame);


        const button_frame = FrameFactory.basicChildFrame(0.6, 0.8);
        const left_button_frame = FrameFactory.basicChildFrame(0.6, 0.4, true);
        const right_button_frame = FrameFactory.basicChildFrame(0.6, 0.4, true);
        frame.addElement(button_frame);
        button_frame.addElement(left_button_frame);
        button_frame.addElement(right_button_frame);

        let count = 0;
        map_content_label.forEach((label, content) => {
            FrameFactory.buttonPack(
                count++ < 5 ? left_button_frame : right_button_frame,
                content,
                label,
                scene,
                front
            );
        })


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
        del_btn.disableButton();

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
            front.removeChild(frame);
            front.next(FrameType.Main);
        }

        const fcnt1 = () => {
            front.removeChild(frame);
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
        const text_frame = interface_json["content"]["train_mic"];;

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
                    () => front.next(FrameType.TrainingInfo))
            },
            "Start");

        frame.addOnBefore(() => {
            scene.factory.change_instrument("microphone", scene)
        });

        return frame;
    }


    static trainDrums(scene, front: Interface) {
        const text_frame = interface_json["content"]["train_drums"];

        const frame = FrameFactory.content_video_button_frame(FrameType.TrainingDrum,
            text_frame,
            "videos_demo/playing_drums.mp4",
            function () {
                FrameFactory.learningProcess(
                    front,
                    scene,
                    "drums",
                    null,
                    () => front.next(FrameType.TrainingMic))
            },
            "Start");

        frame.addOnBefore(() => { scene.factory.change_instrument("drums", scene); });

        return frame;
    }

    static generateBigCounters() {
        const frames = []
        frames.push(FrameFactory.text_frame(FrameType.Ready, "Ready..."));
        frames.push(FrameFactory.text_frame(FrameType.Set, "Set"));
        frames.push(FrameFactory.text_frame(FrameType.GO, "GO!"));

        return frames;
    }

    static appInstructionsFrame(front: Interface) {
        const text_frame = interface_json["content"]["app_instructions_frame"];

        return FrameFactory.yes_no_frame(FrameType.AppInstructions, text_frame, function () {
            front.next(FrameType.Tutorial);
        }, function () {
            front.next(FrameType.Main);
        },
            "I need that tutorial!",

            "Got it!");
    }

    static tutorial(front: Interface) {

        const res = [];

        let order = 0;
        function createTuto(type, text, path, fct, label) {
            const tuto = FrameFactory.content_video_button_frame(type, text, path, fct, label);
            tuto.order = order++;
            return tuto;
        }
        const video_path = [
            "/videos_demo/no_instrument.mp4",
            "/videos_demo/microphone.mp4",
            "/videos_demo/drums.mp4",
            "/videos_demo/ai_training.mp4",
            "/videos_demo/ai_training_p2.mp4",
            "/videos_demo/auto.mp4",
            "/videos_demo/ai_delete.mp4",
            "/videos_demo/reset_training.mp4"
        ];
        const text_tuto = interface_json["content"]["tutorial"];

        for (let i = 0; i < video_path.length; i++) {
            const fct = () => front.next(FrameType.Tutorial);
            res.push(createTuto(FrameType.Tutorial, text_tuto[i], video_path[i], fct, "Next"));
        }

        const end = FrameFactory.content_button_frame(
            FrameType.Tutorial,
            "That's it! \n You are now ready to play some AR music!\nEnjoy!",
            function () {
                front.next(FrameType.Main);
            },
            "Cool!");
        end.order = order++;

        res.push(end);

        return res;

    }

    static infoTrainingFrame(front: Interface) {
        const text_frame = interface_json["content"]["info_training_frame"];
        return FrameFactory.content_button_frame(FrameType.TrainingInfo, text_frame, function () {
            front.next(FrameType.Main);
        }, "Got it!");
    }

    static clearTraining(scene, front: Interface) {
        const content = interface_json["content"]["reset_gestures"];

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
                    fontFamily: 'fonts/gothic-msdf.json',
                    fontTexture: 'fonts/gothic.png',
                }),
                FrameType.SmallCounter,
                (frame) => Frame.basicResize(frame, 0.7)
            );
            frame.addElement(new MeshText(`${i}`, 0.06));
            frames.push(frame);
        }
        return frames;
    }
}