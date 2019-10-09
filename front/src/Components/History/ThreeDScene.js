import React from "react";
import * as THREE from "three";

const OrbitControls = require("three-orbit-controls")(THREE);

class ThreeDScene extends React.Component {
    constructor(props) {
        super(props);
        this.initializeCamera = this.initializeCamera.bind(this);
        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        const {scan, layers, filtered} = this.props;
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        this.initializeCamera();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.initializeOrbits();

        this.geometry = new THREE.Geometry();

        let z = 0.0;

        if (layers.length && layers[0].index)
            layers.sort((a, b) => (a.index > b.index) ? 1 : -1);

        layers.forEach((layer) => {
            let points = [];
            if (!filtered) {
                points = layer.points;
            } else {
                points = layer.filteredPoints;
            }
            points.forEach((point) => {
                let vertex = new THREE.Vector3();
                vertex.x = point.x;
                vertex.y = point.y;
                vertex.z = z;

                this.geometry.vertices.push(vertex);
            });
            z += (scan.sensorStep / 1000);
        });

        this.material = new THREE.PointsMaterial({color: "white", size: 0.15});
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.rotation.x = -1.55;
        this.scene.add(this.mesh);

        let light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.setScalar(100);
        this.scene.add(light);

        this.axesHelper = new THREE.AxesHelper(6);
        this.scene.add(this.axesHelper);

        this.animate();
    }

    initializeCamera() {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 35;
    }

    initializeOrbits() {
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
    }

    animate() {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (
            <div
                id="boardCanvas"
                style={{width: "66vw", height: "75vh"}}
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}

export default ThreeDScene;