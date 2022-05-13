import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Frame from "./Frame";
import Interface from "./Interface";

declare function require(name: string);

export default class FrameFactory {

    static frame_count = 0;

    static starting_frame(content, front: Interface) {
        const distance = 50;
        const height = distance;
        const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
        const width = distance / ratio;

        const frame = new Frame(new ThreeMeshUI.Block({
            height: height * 0.7,
            width: width * 0.7,
            fontSize: 100 / height,
            padding: 0.5,
            margin: 0.5,
            borderRadius: 10,
            backgroundColor: new THREE.Color(0x2d8a85),
            backgroundOpacity: 0.7,
            justifyContent: 'end',
            contentDirection: 'column',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
            const distance = 50;
            frame.obj.position.setZ(globalThis.APPNamespace.height - distance);
            const height = distance;
            const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
            const width = distance / ratio;
            frame.obj.width = width * 0.7;
            frame.obj.height = height * 0.7;
            frame.obj.fontSize = 100 / height;
        });

        const frame2 = new Frame(new ThreeMeshUI.Block({
            height: height * 0.5,
            width: width * 0.5,
            justifyContent: 'center',
            borderRadius: 10,
            margin: 0.5,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0.7,
            offset: 0.05
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
        });

        frame.addElement(frame2);
        frame2.obj.add(new ThreeMeshUI.Text({ content: content }));

        frame.addElement(new Button("Next",
            function () {
                console.log("Next");
                front.next(1);
            },
            false,
            {
                width: 0.1 * height,
                height: 0.1 * height,
                justifyContent: 'center',
                borderRadius: 2,
                offset: 0.05,
                margin: 0.5
            }
        ));
        return frame;
    }

    static default_frame(scene: BodyTrackerScene, front: Interface) {
        const frame = new Frame(new ThreeMeshUI.Block({
            fontSize: 0.2,
            padding: 0.02,
            borderRadius: 0.11,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.4,
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
            const distance = 50;
            frame.obj.position.setZ(globalThis.APPNamespace.height - distance);
            const height = distance;
            const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
            const width = distance / ratio;
            if (ratio < 1) {
                // WEB
                const button_size = height / 10;
                frame.obj.scale.setX(button_size).setY(button_size);
                frame.obj.position.setX(- width / 2 + button_size * (frame.children.length * 0.8))
                    .setY(height / 2 - button_size / 1.15 - 0.02);
            }
            else {
                // MOBILE
                const button_size = height / 6;
                frame.obj.scale.setY(button_size).setX(button_size);
                frame.obj.position.setX(- width / 2 + button_size * (frame.children.length * 0.5 + 0.54))
                    .setY(height / 2 - button_size / 1.15 - 0.02);
            }

        });

        frame.addElement(new Button("No instrument",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("", scene);
            }));


        frame.addElement(new Button("Mic",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("microphone", scene);
            }));

        frame.addElement(new Button("Drums",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.disable();
                globalThis.APPNamespace.modeAuto = false;
                scene.factory.change_instrument("drums", scene);
            }));

        frame.addElement(new Button("Auto",
            function () {
                scene.classifier.stopLearning();
                scene.classifier.enable();
                console.log("Now using the trained KNN !");
                scene.factory.change_instrument("", scene);
            }));

        frame.addElement(new Button("Start Training",
            function () {
                front.next(2);
                scene.classifier.stopLearning();
                scene.classifier.disable();
                scene.factory.change_instrument("", scene);
            }));

        return frame;
    }


    static training_instructions(scene: BodyTrackerScene, front: Interface) {
        const distance = 50;
        const height = distance;
        const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
        const width = distance / ratio;


        const frame = new Frame(new ThreeMeshUI.Block({
            height: height * 0.8,
            width: width * 0.7,
            fontSize: 100 / height,
            borderRadius: 10,
            backgroundColor: new THREE.Color(0x2d8a85),
            backgroundOpacity: 0.7,
            justifyContent: 'end',
            contentDirection: 'column',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
            const distance = 50;
            frame.obj.position.setZ(globalThis.APPNamespace.height - distance);
            const height = distance;
            const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
            const width = distance / ratio;
            frame.obj.width = width * 0.7;
            frame.obj.height = height * 0.7;
            frame.obj.fontSize = 100 / height;
        });

        const text_frame = new Frame(new ThreeMeshUI.Block({
            height: height * 0.2,
            width: width * 0.7,
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0.7,
            offset: 0.05
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
        });
        frame.addElement(text_frame);
        text_frame.obj.add(new ThreeMeshUI.Text({ content: "Training is about to start \n Pick an action to learn" }));


        const button_frame = new Frame(new ThreeMeshUI.Block({
            height: height * 0.5,
            width: width * 0.7,
            justifyContent: 'center',
            contentDirection: 'row',
            borderRadius: 10,
            backgroundColor: new THREE.Color(0xba2f8e),
            backgroundOpacity: 0.7,
            offset: 0.05
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
        });
        frame.addElement(button_frame);


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
            width: 0.2 * height,
            height: 0.1 * height,
            justifyContent: 'center',
            borderRadius: 2,
            offset: 0.05,
            margin: 0.5
        }
        button_frame.addElement(new Button("Mic",
            () => learningProcess("microphone"),
            false,
            buttons_option
        ));
        button_frame.addElement(new Button("Drums",
            () => learningProcess("drums"),
            false,
            buttons_option
        ));
        button_frame.addElement(new Button("Harp",
            () => learningProcess("harp"),
            false,
            buttons_option
        ));

        return frame;
    }


    static text_frame(content) {
        const distance = 50;
        const height = distance;
        const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
        const width = distance / ratio;


        const frame = new Frame(new ThreeMeshUI.Block({
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
        }), `frame_${FrameFactory.frame_count++}`, function resize(frame: Frame) {
            const distance = 50;
            frame.obj.position.setZ(globalThis.APPNamespace.height - distance);
            const height = distance;
            const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
            const width = distance / ratio;
            frame.obj.width = width * 0.7;
            frame.obj.height = height * 0.7;
            frame.obj.fontSize = 100 / height * 5;
        });

        frame.obj.add(new ThreeMeshUI.Text({ content: content }));
        return frame;
    }
}