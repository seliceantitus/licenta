import React from "react";
import * as THREE from 'three';


class History extends React.Component {

    constructor(props) {
        super(props);
        console.log('[HISTORY] Constructed');
        const scene = new THREE.Scene();
    }

    componentWillUnmount() {
        console.log('[HISTORY] Unmount');
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