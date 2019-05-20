import React from "react";
import * as THREE from 'three';



class History extends React.Component {

    constructor(props) {
        super(props);

        const scene = new THREE.Scene();
    }


    render() {
        return (
            <div>
                <h1>History</h1>
            </div>
        );
    }
}

export default History;