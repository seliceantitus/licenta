import React from "react";
import {Grid} from "@material-ui/core";
import {API} from "../../Constants/URL";
import ThreeDScene from "../../Components/Viewer/ThreeDScene";


class Viewer extends React.Component {

    constructor(props) {
        super(props);

        this.scan_id = this.props.match.params.scan_id;
        this.state = {
            scan: null,
            distances: null,
            points: null,
            dataLoaded: false,
        }
    }

    componentDidMount() {
        fetch(
            API.SCAN_VIEW.URL(this.scan_id),
            {
                method: API.SCAN_VIEW.METHOD
            })
            .then(response => response.json())
            .then(
                response => {
                    const {layers, scan} = response.data;
                    this.setState({scan: scan, layers: layers, dataLoaded: true});
                    const dist = [];
                    layers.forEach((layer) => {
                        dist.push(layer.distances);
                    });
                    console.log(JSON.stringify(dist));
                },
                err => {
                    console.log(err)
                })
            .catch(err => console.log(err));
    }

    render() {
        if (!this.state.dataLoaded) return null;
        else {
            return (
                <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                    <ThreeDScene layers={this.state.layers}/>
                </Grid>
            );
        }
    }
}

export default Viewer;