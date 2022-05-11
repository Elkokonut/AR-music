import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Frame from "./Frame";
import Toogle, { ToogleType } from "./Toogle";
import ImageTexture from "../../utils/ImageTexture";

declare function require(name: string);

export default class FrameFactory {

    static text_frame() {

    }

    static default_frame(scene: BodyTrackerScene) {
        const frame = new Frame(new ThreeMeshUI.Block({
            fontSize: 0.2,
            padding: 0.02,
            borderRadius: 0.11,
            backgroundColor: new THREE.Color(0xfffff),
            backgroundOpacity: 0.1,
            justifyContent: 'center',
            contentDirection: 'row-reverse',
            fontFamily: require('../../../../static/fonts/gothic-msdf.json'),
            fontTexture: require('../../../../static/fonts/gothic.png')
        }), "default_frame", function resize(frame: Frame) {
            const distance = 50;
            frame.obj.position.setZ(globalThis.APPNamespace.height - distance);
            const height = distance;
            const ratio = globalThis.APPNamespace.height / globalThis.APPNamespace.width;
            const width = distance / ratio;
            if (ratio < 1) {
                // WEB
                const button_size = height / 10;
                frame.obj.scale.setX(button_size).setY(button_size);
                frame.obj.position.setX(- width / 2 + button_size * (frame.children.length * 0.5 + 0.54))
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


        frame.addElement(new Button("Train",
            function () {
                globalThis.APPNamespace.detectInstrument = true;
            }));
        frame.addElement(new Button("Mic",
            function () {
                globalThis.APPNamespace.detectInstrument = false;
                scene.factory.change_instrument("microphone", scene);
            }));

        frame.addElement(new Button("Drums",
            function () {
                globalThis.APPNamespace.detectInstrument = false;
                scene.factory.change_instrument("drums", scene);
            }));

        return frame;
    }

}