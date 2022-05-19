import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Frame from "./Frame";
import Interface from "./Interface";

declare function require(name: string);

export default class FrameFactory {

    static frame_count = 0;

    static starting_frame(front: Interface) {
        const text_intro = "Welcome! \nPlease use headphones.\n Interact with the interface using your indexes.";

        return FrameFactory.content_button_frame(text_intro, function () {
            console.log("Next");
            front.next(1);
        });
    }

    static train_mic(scene, front: Interface) {
        const text_frame = "Mimick singing in a mic to train AI";
        const learningProcess = function (label) {
            scene.factory.change_instrument(label, scene);
            if (scene.factory.isLoaded(label)) {
                front.next(5);
                setTimeout(() => {
                    front.next(4);
                }, 1000);
                setTimeout(() => {
                    front.next(3);
                }, 2000);
                setTimeout(() => {
                    scene.classifier.startLearning(label);
                    scene.classifier.disable();
                    front.next(6);
                }, 3000);
                setTimeout(() => {
                    front.hide();
                }, 4000);
                setTimeout(() => {
                    scene.classifier.stopLearning();
                    scene.factory.change_instrument("", scene);
                    front.next(8);
                }, 13000);
            }
        }
        const frame = FrameFactory.content_button_frame(text_frame, function () { learningProcess("microphone") }, "Start");

        frame.onBefore = () => { scene.factory.change_instrument("microphone", scene); }

        return frame;
    }


    static train_drums(scene, front: Interface) {
        const text_frame = "Mimick playing the drum to train AI";
        const learningProcess = function (label) {
            scene.factory.change_instrument(label, scene);
            front.next(5);

            setTimeout(() => {
                front.next(4);
            }, 1000);
            setTimeout(() => {
                front.next(3);
            }, 2000);
            setTimeout(() => {
                scene.classifier.startLearning(label);
                scene.classifier.disable();
                front.next(6);
            }, 3000);
            setTimeout(() => {
                front.hide();
            }, 4000);
            setTimeout(() => {
                scene.classifier.stopLearning();
                scene.classifier.enable();
                scene.factory.change_instrument("", scene);
                front.next(9);
            }, 13000);
        }
        const frame = FrameFactory.content_button_frame(text_frame, function () { learningProcess("drums") }, "Start");
        frame.onBefore = () => { scene.factory.change_instrument("drums", scene); }

        return frame;
    }

    static info_training_frame(front: Interface) {
        const text_frame = "You can add new instruments or improve the detection by clicking \non 'Start training' again"
        return FrameFactory.content_button_frame(text_frame, function () {
            front.next(1);
        }, "Got it!");
    }



    static content_button_frame(content, action, button_text = "Next") {
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
            `frame_${FrameFactory.frame_count++}`
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
            , `frame_${FrameFactory.frame_count++}`
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

    static default_frame(scene: BodyTrackerScene, front: Interface) {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = Frame.distance / ratio;

        const frame = new Frame(new ThreeMeshUI.Block({
            padding: 0.02,
            borderRadius: 1,
            fontSize: 1,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.4,
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), `frame_${FrameFactory.frame_count++}`,
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
                    front.next(7);
                }
                else {
                    front.next(2);
                }
            },
            false,
            buttons_option
        ));

        return frame;
    }


    static training_instructions(scene: BodyTrackerScene, front: Interface) {
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
            `frame_${FrameFactory.frame_count++}`
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
            `frame_${FrameFactory.frame_count++}`
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
            `frame_${FrameFactory.frame_count++}`
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
        const left_button_frame = new Frame(new ThreeMeshUI.Block(block_options), `frame_${FrameFactory.frame_count++}`);
        button_frame.addElement(left_button_frame);

        const right_button_frame = new Frame(new ThreeMeshUI.Block(block_options), `frame_${FrameFactory.frame_count++}`);
        button_frame.addElement(right_button_frame);


        const learningProcess = function (label) {
            front.next(5);
            setTimeout(() => {
                front.next(4);
            }, 1000);
            setTimeout(() => {
                front.next(3);
            }, 2000);
            setTimeout(() => {
                scene.classifier.startLearning(label);
                scene.classifier.disable();
                scene.factory.change_instrument("", scene);
                front.next(6);
            }, 3000);
            setTimeout(() => {
                front.hide();
            }, 4000);
            setTimeout(() => {
                scene.classifier.stopLearning();
                scene.classifier.enable();
                front.next(1);
            }, 13000);
        }

        const buttons_option = {
            width: 0.4 * height,
            height: 0.1 * height,
            justifyContent: 'center',
            borderRadius: 2,
            offset: 0.05,
            margin: 0.5
        }
        left_button_frame.addElement(new Button("Mic",
            () => learningProcess("microphone"),
            false,
            buttons_option
        ));
        left_button_frame.addElement(new Button("Drums",
            () => learningProcess("drums"),
            false,
            buttons_option
        ));
        left_button_frame.addElement(new Button("Harp",
            () => learningProcess("harp"),
            false,
            buttons_option
        ));

        left_button_frame.addElement(new Button("Sound 1",
            () => learningProcess("Sound 1"),
            false,
            buttons_option
        ));

        left_button_frame.addElement(new Button("Sound 2",
            () => learningProcess("Sound 2"),
            false,
            buttons_option
        ));

        right_button_frame.addElement(new Button("Sound 3",
            () => learningProcess("Sound 1"),
            false,
            buttons_option
        ));

        right_button_frame.addElement(new Button("Sound 4",
            () => learningProcess("Sound 4"),
            false,
            buttons_option
        ));

        right_button_frame.addElement(new Button("Sound 5",
            () => learningProcess("Sound 5"),
            false,
            buttons_option
        ));

        right_button_frame.addElement(new Button("Sound 6",
            () => learningProcess("Sound 6"),
            false,
            buttons_option
        ));

        right_button_frame.addElement(new Button("Sound 7",
            () => learningProcess("Sound 7"),
            false,
            buttons_option
        ));


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
            `frame_${FrameFactory.frame_count++}`
        ));



        return frame;
    }


    static text_frame(content) {
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
                fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
                fontTexture: require('../../../../static/fonts/gothic.png')
            }),
            `frame_${FrameFactory.frame_count++}`
        );

        frame.obj.add(new ThreeMeshUI.Text({ content: content }));
        return frame;
    }



}