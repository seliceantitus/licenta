import React from "react";
import {CircularProgress, Grid, withStyles} from "@material-ui/core";
import {API} from "../../Constants/URL";
import {Delete, Edit} from "@material-ui/icons";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_SUCCESS, TOAST_WARN} from "../../Constants/UI";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import {SCAN_STATUS} from "../../Constants/Communication";
import {SCAN_DATA_DELETED} from "../../Constants/Messages";

const styles = theme => ({
    listButton: {
        focusVisible: false
    }
});

class History extends React.Component {

    constructor(props) {
        super(props);
        const {toastCallback} = this.props;

        this.state = {
            scans: {}
        };

        this.fetchScanDetails = this.fetchScanDetails.bind(this);

        this.showToast = toastCallback;
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
                    setTimeout(
                        () => this.setState({scans: response.data, dataLoaded: true}),
                        500);
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

    deleteScan = (scan_id) => {
        fetch(
            API.SCAN_DELETE.URL(scan_id),
            {
                method: API.SCAN_DELETE.METHOD,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(
                data => {
                    // this.showToast(TOAST_WARN, 'DELETED');
                    this.setState(state => {
                        return {
                            ...state,
                            scans: state.scans.filter(scan => scan._id !== scan_id)
                        }
                    });
                },
                err => {
                    console.log(err);
                })
            .catch(err => console.log(err));
    };

    renderScansList = () => (
        // component={Link} to={`/viewer/${scan._id}`}
        this.state.scans.map((scan, index) =>
            <MenuItem key={`Scan-${index}`}>
                <Typography noWrap>
                    {scan.name}
                </Typography>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => console.log('Edit')}>
                        <Edit/>
                    </IconButton>
                    <IconButton onClick={() => this.deleteScan(scan['_id'])}>
                        <Delete color={"secondary"}/>
                    </IconButton>
                </ListItemSecondaryAction>
            </MenuItem>
        )
    );

    render() {
        if (!this.state.dataLoaded) return <CircularProgress/>;
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2}>
                <Grid container item direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={2} xl={2}
                >
                    <Paper>
                        <MenuList>
                            {this.renderScansList()}
                        </MenuList>
                    </Paper>
                </Grid>
                <Grid container item direction={"column"} justify={"center"} alignItems={"stretch"}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={8} xl={8}
                >
                    <Paper>
                        Test
                    </Paper>
                </Grid>
            </Grid>
            // </Grid>
        );
    }
}

export default withStyles(styles)(History);