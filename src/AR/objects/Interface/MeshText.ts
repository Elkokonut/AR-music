import Object3D from "../Object3D";
import * as ThreeMeshUI from 'three-mesh-ui';
import Frame from "./Frame";

export default class MeshText extends Object3D {
    static text_count = 0;
    fontSizeRatio: number;
    constructor(content, fontSizeRatio) {
        const obj = new ThreeMeshUI.Text({ content: `${content}` })
        super(obj, `frame_${MeshText.text_count++}`, null);
        this.fontSizeRatio = fontSizeRatio;
    }

    resize() {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = height / ratio;

        const min = Math.min(height, width);

        this.obj.set({ fontSize: this.fontSizeRatio * min });
    }
}