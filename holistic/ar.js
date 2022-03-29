import * as THREE from 'three';
import OneEuroFilter2D from './oneEuroFilter.js';


class Object3D {
    constructor(obj, name, scene, position, scale) {
        this.scene = scene;
        this.obj = obj;
        this.obj.name = name;
        this.type = "object3D";
        if (position)
            this.obj.position.set(position[0], position[1], position[2]);
        if (scale)
            this.obj.scale.set(scale[0], scale[1], scale[2]);
        scene.add(this.obj);
    }
}


class BodyTrackerObject extends Object3D {
    constructor(obj, name, scene, position, scale, keypoint_name) {
        super(obj, name, scene, position, scale);
        this.obj.visible = false;
        this.keypoint_name = keypoint_name;
        this.euroFilter = null;
        this.type = "BodyTrackerObject";
    }
    _normalized_to_pixel_coordinates(normalized_x, normalized_y, image_width, image_height) {
        /* Converts normalized value pair to pixel coordinates. */
        var x_px, y_px;
      
        function is_valid_normalized_value(value) {
          return (value >= 0 ) && (value <= 1);
        }
      
        if (!(is_valid_normalized_value(normalized_x) && is_valid_normalized_value(normalized_y))) {
          return null;
        }
      
        x_px = Math.min(Math.floor(normalized_x * image_width), image_width - 1);
        y_px = Math.min(Math.floor(normalized_y * image_height), image_height - 1);
        return [x_px, y_px];
      }

    animate(mesh, width, height) {
        if (mesh != null) {
            this.change_position2d(mesh, width, height);
        }
    }

    change_position2d(mesh, width, height) {
        var keypoint = mesh[parseInt(this.keypoint_name, 10)];
        if (!keypoint)
        {
            this.obj.visible = false;
            return;
        }
        keypoint = this._normalized_to_pixel_coordinates(keypoint.x, keypoint.y, width, height);
        if (keypoint) {
            this.obj.visible = true;
            var x = keypoint[0];
            var y = keypoint[1];
            x = (x - width / 2);
            y = - (y - height / 2);
            if (!this.euroFilter)
                this.euroFilter = new OneEuroFilter2D(x, y, Date.now(), 0.001, 1.0);
            else {
                var estimation = this.euroFilter.call(x, y);
                if (estimation) {
                    x = estimation[0];
                    y = estimation[1];
                }
            }
            this.obj.position.x = x;
            this.obj.position.y = y;
        }
        else
            this.obj.visible = false;
    }
}


class Cube extends BodyTrackerObject {
    constructor(name, scale, color, keypoint_name, scene) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        super(cube, name, scene, null, scale, keypoint_name);
        this.cube = cube;
        this.type = "cube";
    }
    animate(mesh, width, height) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        super.animate(mesh, width, height)
    }
}

class Disk extends BodyTrackerObject {
    constructor(name, color, scene) {
        const material = new THREE.MeshBasicMaterial({ color: color });
        const geometry = new THREE.CircleGeometry(5, 32);
        var circle = new THREE.Mesh(geometry, material);
        super(circle, name, scene, null, null, name);
        this.circle = circle;
        this.type = "Disk";
    }
    animate(mesh, width, height) {
        super.animate(mesh, width, height)
    }
}


class Scene {
    constructor(video) {
        this.video = video;
        this.width = 0;
        this.height = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.initialisation = false;

        this.objects = []
    }

    init(width = null, height = null) {
        console.log("Init Scene");
        this.width = width ? width : this.video.videoWidth;
        this.height = height ? height : this.video.videoHeight;

        this.scene = new THREE.Scene();
        var texture = new THREE.VideoTexture(this.video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        this.scene.background = texture;
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 0);
        this.camera.position.z = this.height;

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
        document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); \
                                                    -webkit-transform: scale(-1, 1); \
                                                    -o-transform: scale(-1, 1); \
                                                    transform: scale(-1, 1); \
                                                    filter: FlipH;\
                                                    width: 100%; \
                                                    max-width: 100%; \
                                                    height: 100%;';
        this.camera.lookAt(0, 0, 0);

        // this.addGridHelper();

        this.initialisation = true;
    }


    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }
}



export default class BodyTrackerScene extends Scene {

    constructor(video) {
        super(video);
    }

    async init(width = null, height = null) {
        super.init(width, height);

        //this.objects.push(new Cube("leftHandCube", [20, 20, 20], 0x00ff00, "left_wrist", this.scene));
        //this.objects.push(new Cube("rightHandCube", [20, 20, 20], 0x0000ff, "right_wrist", this.scene));

        for (let index = 0; index < 75; index++) {
            this.objects.push(new Disk(index.toString(), 0xff00ff, this.scene));
        }
        var nb_calls_render = 0;
        setInterval(() => {
            document.getElementById("frameRateRender").innerHTML = 'Render FrameRate: ' + nb_calls_render;
            nb_calls_render = 0;
        }, 1000);


        function FpsCtrl(fps, callback) {

            var delay = 1000 / fps,                               // calc. time per frame
                time = null,                                      // start time
                frame = -1,                                       // frame count
                tref;                                             // rAF time reference

            function loop(timestamp) {
                if (time === null) time = timestamp;              // init start time
                var seg = Math.floor((timestamp - time) / delay); // calc frame no.
                if (seg > frame) {                                // moved to next frame?
                    frame = seg;                                  // update
                    callback({                                    // callback function
                        time: timestamp,
                        frame: frame
                    })
                }
                tref = requestAnimationFrame(loop)
            }
            // play status
            this.isPlaying = false;

            // set frame-rate
            this.frameRate = function (newfps) {
                if (!arguments.length) return fps;
                fps = newfps;
                delay = 1000 / fps;
                frame = -1;
                time = null;
            };

            // enable starting/pausing of the object
            this.start = function () {
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    tref = requestAnimationFrame(loop);
                }
            };

            this.pause = function () {
                if (this.isPlaying) {
                    cancelAnimationFrame(tref);
                    this.isPlaying = false;
                    time = null;
                    frame = -1;
                }
            };
        }
        var fc = new FpsCtrl(60, () => {
            // render each frame here
            nb_calls_render++;
            this.move_objects(null);
            this.renderer.render(this.scene, this.camera);
        });
        fc.start();
    }

    move_objects(mesh) {
        this.objects.forEach(obj => {
            obj.animate(mesh, this.width, this.height);
        });
    }

}