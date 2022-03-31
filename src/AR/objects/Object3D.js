export default class Object3D {
    constructor(obj, name, scale) {
        this.obj = obj;
        this.obj.name = name;
        this.z = 0;
        this.scale = [1, 1, 1];
        if (scale)
        {
            this.obj.scale.set(scale[0], scale[1], scale[2]);
            this.scale = scale;
        }

    }
}