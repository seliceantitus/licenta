import React from "react";
import * as THREE from 'three';
import {Grid} from "@material-ui/core";


class Viewer extends React.Component {

    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.initializeCamera = this.initializeCamera.bind(this);
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});

        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        this.initializeCamera();

        this.geometry = new THREE.Geometry();
        const points = [
            {z: 0.000000, x: 5.000000, y: 0.000000},
            {z: 3.526712, x: 4.854102, y: 0.000000},
            {z: 4.755283, x: 1.545085, y: 0.000000},
            {z: 6.657396, x: -2.163119, y: 0.000000},
            {z: 2.351141, x: -3.236068, y: 0.000000},
            {z: 0.000000, x: -6.000000, y: 0.000000},
            {z: -2.938926, x: -4.045085, y: 0.000000},
            {z: -8.559509, x: -2.781153, y: 0.000000},
            {z: -2.853170, x: 0.927051, y: 0.000000},
            {z: -2.938926, x: 4.045085, y: 0.000000},
            {z: 0.000000, x: 3.000000, y: 1.500000},
            {z: 2.351141, x: 3.236068, y: 1.500000},
            {z: 2.853170, x: 0.927051, y: 1.500000},
            {z: 4.755283, x: -1.545085, y: 1.500000},
            {z: 1.175571, x: -1.618034, y: 1.500000},
            {z: 0.000000, x: -4.000000, y: 1.500000},
            {z: -1.763356, x: -2.427051, y: 1.500000},
            {z: -6.657396, x: -2.163119, y: 1.500000},
            {z: -0.951057, x: 0.309017, y: 1.500000},
            {z: -1.763356, x: 2.427051, y: 1.500000}
        ];
        points.forEach((point) => {
            let vertex = new THREE.Vector3();
            vertex.x = point.x;
            vertex.y = point.y;
            vertex.z = point.z;

            this.geometry.vertices.push(vertex);
        });

        this.material = new THREE.PointsMaterial({color: 0xFFFFFF, size: 0.25});
        this.mesh = new THREE.Points(this.geometry, this.material);

        this.scene.add(this.mesh);
        this.animate();
    }

    initializeCamera() {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 35;
    }

    animate() {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.mesh.rotation.x += 0.001;
    }

    render() {
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <div
                    id="boardCanvas"
                    style={{width: "80vw", height: "40vw"}}
                    ref={mount => {
                        this.mount = mount;
                    }}
                />
            </Grid>
        );
    }
}

export default Viewer;