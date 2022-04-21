import Object3D from './Object3D';

export default class Occluser extends Object3D {
    protected constructor(obj, name) {
        obj.material.colorWrite = false;
        obj.visible = false;

        super(obj, name, null);
    }


    animate(distance) {
        super.animate(null);
        this.obj.position.z = distance;
    }
}