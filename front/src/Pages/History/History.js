import React from "react";
import {CircularProgress, Grid, withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {API} from "../../Constants/URL";
import {Delete, Edit, Visibility} from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

const styles = theme => ({
    listButton: {
        focusVisible: false
    }
});

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

    renderScansList = () => (
        // component={Link} to={`/viewer/${scan._id}`}
        this.state.scans.map((scan, index) =>
            <ListItem key={`Scan-${index}`}>
                <ListItemText primary={scan.name}/>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => console.log('View')}>
                        <Visibility/>
                    </IconButton>
                    <IconButton onClick={() => console.log('Edit')}>
                        <Edit/>
                    </IconButton>
                    <IconButton onClick={() => console.log('Delete')}>
                        <Delete/>
                    </IconButton>

                </ListItemSecondaryAction>
                {/*<Button onClick={() => this.fetchScanDetails(scan._id)}>*/}
                {/*    View 3D*/}
                {/*</Button>*/}
            </ListItem>
        )
    );

    render() {
        if (!this.state.dataLoaded) return <CircularProgress/>;
        return (
            /*<Grid container justify={"flex-start"} alignItems={"flex-start"} spacing={2} direction={"row"}>*/
                <List>
                    {this.renderScansList()}
                </List>
            // </Grid>
        );
    }
}

export default withStyles(styles)(History);