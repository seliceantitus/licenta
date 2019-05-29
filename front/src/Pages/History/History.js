import React from "react";
import {CircularProgress, Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {API} from "../../Constants/URL";
import {ThreeSixty} from "@material-ui/icons";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

class History extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scans: {}
        };

        this.fetchScanDetails = this.fetchScanDetails.bind(this);
    }

    componentDidMount() {
        fetch(
            API.SCAN_INDEX.URL,
            {
                method: API.SCAN_INDEX.METHOD
            })
            .then(response => response.json())
            .then(
                response => {
                    this.setState({scans: response.data, dataLoaded: true})
                },
                err => {
                    console.log(err)
                })
            .catch(err => console.log(err));
    }

    fetchScanDetails(scan_id) {
        fetch(
            API.SCAN_VIEW.URL(scan_id),
            {
                method: API.SCAN_VIEW.METHOD
            })
            .then(response => response.json())
            .then(
                response => {
                    console.log(response);
                },
                err => {
                    console.log(err)
                })
            .catch(err => console.log(err));
    }

    render() {
        if (!this.state.dataLoaded) return <CircularProgress/>
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <Paper>
                    {
                        this.state.scans.map((scan, index) =>
                            <>
                                <ListItem button component={Link} to={`/viewer/${scan._id}`} key={`Scan-${index}`}>
                                    {scan.name}
                                    <ThreeSixty onClick={() => this.fetchScanDetails(scan._id)}/>
                                </ListItem>
                                <Divider/>
                            </>
                        )
                    }
                </Paper>
            </Grid>
        );
    }
}

export default History;