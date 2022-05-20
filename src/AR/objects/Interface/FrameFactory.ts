import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Frame, { FrameType } from "./Frame";
import Interface from "./Interface";

declare function require(name: string);

export default class FrameFactory {

    static generateAllFrames(scene: BodyTrackerScene, front: Interface) {
        const frames: Frame[] = [];

        frames.push(FrameFactory.startingFrame(front)); // "starting_frame"
        frames.push(FrameFactory.mainFrame(scene, front)); // "main"
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



    private static learningProcess(front, scene, label, onBefore, onAfter) {
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
                fontSize: 100 / height,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x47ada1),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png')
            }),
            type
        );

        const frame2 = new Frame(
            new ThreeMeshUI.Block(
                {
                    height: height * 0.5,
                    width: width * 0.6,
                    justifyContent: 'center',
                    borderRadius: 10,
                    margin: 0.5,
                    backgroundColor: new THREE.Color(0xba2f8e),
                    backgroundOpacity: 0,
                    offset: 0.05
                })
            , FrameType.ChildFrame
        );

        frame.addElement(frame2);
        frame2.obj.add(new ThreeMeshUI.Text({ content: content }));

        frame.addElement(new Button(button_text,
            action,
            false,
            {
                width: 0.15 * height,
                height: 0.15 * height,
                justifyContent: 'center',
                borderRadius: 2,
                offset: 0.05,
                margin: 0.5
            }
        ));
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
                fontSize: 100 / height,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x47ada1),
                backgroundOpacity: 0.7,
                justifyContent: 'end',
                contentDirection: 'column',
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png')
            }),
            type
        );

        const frame2 = new Frame(
            new ThreeMeshUI.Block(
                {
                    height: height * 0.5,
                    width: width * 0.6,
                    justifyContent: 'center',
                    borderRadius: 10,
                    margin: 0.5,
                    backgroundColor: new THREE.Color(0xba2f8e),
                    backgroundOpacity: 0,
                    offset: 0.05
                })
            , FrameType.ChildFrame
        );

        frame.addElement(frame2);
        frame2.obj.add(new ThreeMeshUI.Text({ content: content }));

        const frame3 = new Frame(
            new ThreeMeshUI.Block(
                {
                    height: height * 0.2,
                    width: width * 0.6,
                    justifyContent: 'center',
                    contentDirection: 'row',
                    borderRadius: 10,
                    margin: 0.5,
                    backgroundColor: new THREE.Color(0xba2f8e),
                    backgroundOpacity: 0,
                    offset: 0.05
                })
            , FrameType.ChildFrame
        );

        frame.addElement(frame3);

        frame3.addElement(new Button(button_text2,
            action2,
            false,
            {
                width: 0.15 * height,
                height: 0.15 * height,
                justifyContent: 'center',
                borderRadius: 2,
                offset: 0.05,
                margin: 0.5
            }
        ));
        frame3.addElement(new Button(button_text1,
            action1,
            false,
            {
                width: 0.15 * height,
                height: 0.15 * height,
                justifyContent: 'center',
                borderRadius: 2,
                offset: 0.05,
                margin: 0.5
            }
        ));

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
                fontSize: 100 / height * 10,
                padding: 0.5,
                margin: 0.5,
                borderRadius: 10,
                backgroundColor: new THREE.Color(0x2d8a85),
                backgroundOpacity: 0,
                justifyContent: 'center',
                contentDirection: 'column',
                fontColor: new THREE.Color(0xa7ebe7),
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png')
            }),
            type
        );

        frame.obj.add(new ThreeMeshUI.Text({ content: content }));
        return frame;
    }


    //#endregion

    static startingFrame(front: Interface) {
        const text_intro = "Welcome! \nPlease use headphones.\n Interact with the interface using your indexes.";

        return FrameFactory.content_button_frame(FrameType.StartingFrame, text_intro, function () {
            console.log("Next");
            front.next(FrameType.Main);
        });
    }

    static mainFrame(scene: BodyTrackerScene, front: Interface) {
        const height = Frame.distance;

        const frame = new Frame(new ThreeMeshUI.Block({
            padding: 0.02,
            borderRadius: 1,
            fontSize: 100 / height / 2,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.4,
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), FrameType.Main,
            function resize(frame: Frame) {
                const button_size = buttons_option["width"]
                frame.obj.position.setX(0).setY(height / 2 - button_size / 1.15 - 0.02);
            }
        );

        const buttons_option = {
            width: 0.1 * height,
            height: 0.1 * height,
            justifyContent: 'center',
            borderRadius: 1,
            offset: 0.05,
            margin: 0.5
        }

        frame.addElement(new Button("No instrument",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("", scene);
            },
            false,
            buttons_option
        ));


        frame.addElement(new Button("Mic",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("microphone", scene);
            },
            false,
            buttons_option
        ));

        frame.addElement(new Button("Drums",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("drums", scene);
            },
            false,
            buttons_option
        ));

        frame.addElement(new Button("Auto",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.enable();
                console.log("Now using the trained KNN !");
                scene.factory.change_instrument("", scene);
            },
            false,
            buttons_option
        ));

        frame.addElement(new Button("AI Training",
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
            },
            false,
            buttons_option
        ));


        frame.addElement(new Button("Reset Training",
            function () {
                scene.classifier.disable();
                scene.factory.change_instrument("", scene);
                front.next(FrameType.ClearTraining);
            },
            false,
            buttons_option
        ));

        return frame;
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
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png')
            }),
            FrameType.TrainingMainPanel
        );

        const text_frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.2,
                width: width * 0.8,
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: new THREE.Color(0xba2f8e),
                backgroundOpacity: 0,
                offset: 0.05
            }),
            FrameType.ChildFrame
        );
        frame.addElement(text_frame);
        text_frame.obj.add(new ThreeMeshUI.Text({ content: "Training is about to start \n Pick an action to learn" }));


        const button_frame = new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.6,
                width: width * 0.8,
                justifyContent: 'center',
                contentDirection: 'row',
                borderRadius: 10,
                backgroundColor: new THREE.Color(0xba2f8e),
                backgroundOpacity: 0,
                offset: 0.05
            }),
            FrameType.ChildFrame
        );
        frame.addElement(button_frame);

        const block_options = {
            height: height * 0.6,
            width: width * 0.4,
            justifyContent: 'center',
            contentDirection: 'column',
            borderRadius: 10,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0,
            offset: 0.05
        };
        const left_button_frame = new Frame(new ThreeMeshUI.Block(block_options), FrameType.ChildFrame);
        button_frame.addElement(left_button_frame);

        const right_button_frame = new Frame(new ThreeMeshUI.Block(block_options), FrameType.ChildFrame);
        button_frame.addElement(right_button_frame);

        const buttons_option = {
            width: 0.4 * height,
            height: 0.1 * height,
            justifyContent: 'center',
            borderRadius: 2,
            offset: 0.05,
            margin: 0.5
        }

        const del_buttons_option = {
            width: 0.1 * height,
            height: 0.1 * height,
            justifyContent: 'center',
            borderRadius: 2,
            offset: 0.05,
        }

        const btn_block_options = {
            height: height * 0.1,
            width: width * 0.4,
            justifyContent: 'center',
            contentDirection: 'row',
            borderRadius: 10,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0,
            offset: 0.05,
            margin: 0.5
        };


        function addOption(frame: Frame, name: string, label: string) {
            const button_block = new Frame(new ThreeMeshUI.Block(btn_block_options), FrameType.ChildFrame);
            frame.addElement(button_block);
            button_block.addElement(new Button(name,
                () => FrameFactory.learningProcess(front,
                    scene,
                    label,
                    () => scene.factory.change_instrument("", scene),
                    () => front.next(FrameType.Main)
                ),
                false,
                buttons_option
            ));
            button_block.addElement(new Button("X",
                () => {
                    scene.classifier.removeLabel(label);
                    front.next(FrameType.Main);
                },
                false,
                del_buttons_option,
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
            ));
        }

        addOption(left_button_frame, "Mic", "microphone");
        addOption(left_button_frame, "Drums", "drums");
        addOption(left_button_frame, "Harp", "harp");
        addOption(left_button_frame, "Sound1", "Sound1");
        addOption(left_button_frame, "Sound2", "Sound2");
        addOption(right_button_frame, "Sound3", "Sound");
        addOption(right_button_frame, "Sound4", "Sound");
        addOption(right_button_frame, "Sound5", "Sound");
        addOption(right_button_frame, "Sound6", "Sound");
        addOption(right_button_frame, "Sound7", "Sound");


        frame.addElement(new Frame(new ThreeMeshUI.Block(
            {
                height: height * 0.05,
                width: width * 0.8,
                justifyContent: 'center',
                contentDirection: 'row',
                borderRadius: 10,
                backgroundColor: new THREE.Color(0xba2f8e),
                backgroundOpacity: 0,
                offset: 0.05
            }),
            FrameType.ChildFrame
        ));

        return frame;
    }


    static trainMic(scene, front: Interface) {
        const text_frame = "Mimick singing in a mic to train AI";

        const frame = FrameFactory.content_button_frame(FrameType.TrainingMic, text_frame,
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

        const frame = FrameFactory.content_button_frame(FrameType.TrainingDrum,
            text_frame,
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
                    fontSize: 100 / height,
                    padding: 0.5,
                    margin: 0.5,
                    borderRadius: 10,
                    backgroundColor: new THREE.Color(0x2d8a85),
                    backgroundOpacity: 0,
                    justifyContent: 'start',
                    contentDirection: 'column-reverse',
                    fontColor: new THREE.Color(0xa7ebe7),
                    fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                    fontTexture: require('../../../../static/fonts/gothic.png')
                }),
                FrameType.SmallCounter
            );
            frame.obj.add(new ThreeMeshUI.Text({ content: `${i}` }));

            frames.push(frame);
        }


        return frames;
    }



}