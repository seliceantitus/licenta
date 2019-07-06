import React from "react";
import {
    Avatar,
    CircularProgress,
    createMuiTheme,
    Grid,
    IconButton,
    ListItemSecondaryAction,
    MenuItem,
    MuiThemeProvider,
    Paper,
    Typography,
    withStyles
} from "@material-ui/core";
import {API} from "../../Constants/URL";
import {Delete} from "@material-ui/icons";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH, TOAST_ERROR, TOAST_SUCCESS} from "../../Constants/UI";
import {HISTORY_SELECT_SCAN, SCAN_DELETE} from "../../Constants/Messages";
import ThreeDScene from "../../Components/History/ThreeDScene";
import MenuList from "@material-ui/core/MenuList";

const avatarTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiAvatar: {
            img: {
                objectFit: "scale-down",
            }
        }
    }
});

const styles = theme => ({
    pageHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 0,
        [theme.breakpoints.down('sm')]: {
            width: 64,
            height: 64,
        },
    },
    header: {
        fontWeight: 200,
        fontSize: '3.6rem',
        marginLeft: '2rem',
        textTransform: 'uppercase',
    },
    notConnected: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 50,
    },
    pageMessage: {
        fontWeight: 200,
        fontSize: '1.4rem',
        color: '#777777',
    }
});

class History extends React.Component {

    constructor(props) {
        super(props);
        const {communicationManager, toastCallback} = this.props;
        this.communicationManager = communicationManager;
        this.state = {
            dataLoaded: false,
            scans: {},
            selectedScan: {
                id: null,
                layers: [],
            }
        };

        this.fetchScanDetails = this.fetchScanDetails.bind(this);

        this.showToast = toastCallback;
    }

    componentDidMount() {
        if (this.communicationManager.isSocketConnected()) {
            fetch(
                API.SCAN_INDEX.URL,
                {
                    method: API.SCAN_INDEX.METHOD
                })
                .then(response => response.json())
                .then(
                    response => {
                        this.setState({scans: response.data, dataLoaded: true});
                    },
                    err => {
                        this.showToast(TOAST_ERROR, err)
                    })
                .catch(err => this.showToast(TOAST_ERROR, err));
        }
    }

    fetchScanDetails(scan_id) {
        this.setState({selectedScan: {id: null, layers: []}});
        fetch(
            API.SCAN_VIEW.URL(scan_id),
            {
                method: API.SCAN_VIEW.METHOD
            })
            .then(response => response.json())
            .then(
                response => {
                    const {layers} = response.data;
                    this.setState({selectedScan: {id: scan_id, layers: layers}});
                },
                err => {
                    this.showToast(TOAST_ERROR, err)
                })
            .catch(err => this.showToast(TOAST_ERROR, err));
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
                    this.showToast(TOAST_SUCCESS, SCAN_DELETE);
                    this.setState(state => {
                        return {
                            ...state,
                            scans: state.scans.filter(scan => scan._id !== scan_id)
                        }
                    });
                },
                err => {
                    this.showToast(TOAST_ERROR, err);
                })
            .catch(err => this.showToast(TOAST_ERROR, err));
    };

    renderPageHeader = (classes) => (
        <>
            <MuiThemeProvider theme={avatarTheme}>
                <Avatar aria-label="Arduino Mega"
                        src={require('../../assets/img/png/ArduinoMega.png')}
                        className={classes.avatar}
                />
            </MuiThemeProvider>
            <Typography variant={"h3"} className={classes.header}>History</Typography>
        </>
    );

    renderScansList = () => (
        this.state.scans.map((scan, index) =>
            <MenuItem key={`Scan-${index}`} onClick={() => this.fetchScanDetails(scan['_id'])}>
                <Typography noWrap>
                    {scan.name}
                </Typography>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => this.deleteScan(scan['_id'])}>
                        <Delete color={"secondary"}/>
                    </IconButton>
                </ListItemSecondaryAction>
            </MenuItem>
        )
    );

    renderScene = () => {
        if (this.state.selectedScan.id) {
            return <ThreeDScene layers={this.state.selectedScan.layers}/>
        } else {
            return <Typography variant={"subtitle1"} style={{margin: 10, fontWeight: 400}}>
                {HISTORY_SELECT_SCAN}
            </Typography>
        }
    };

    renderConnectingPage = (classes) => (
        <Grid container justify={"center"} alignItems={"center"} spacing={2} direction={"column"}>
            <Grid container item justify={"center"} alignItems={"center"} direction={"row"}
                  xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                  className={classes.notConnected}
            >
                <CircularProgress/>
            </Grid>

            <Grid container item justify={"center"} alignItems={"center"} direction={"row"}
                  xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                  className={classes.notConnected}
            >
                <Typography variant={"subtitle1"} className={classes.pageMessage}>
                    Waiting for server...
                </Typography>
            </Grid>
        </Grid>
    );

    renderServerNotAvailable = (classes) => (
        <Grid container justify={"center"} alignItems={"center"} spacing={2} direction={"column"}>
            <Grid container item justify={"center"} alignItems={"center"} direction={"row"}
                  xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                  className={classes.notConnected}
            >
                <Typography variant={"subtitle1"} className={classes.pageMessage}>
                    Could not connect to server!
                </Typography>
            </Grid>
        </Grid>
    );

    render() {
        const {classes} = this.props;
        if (!this.communicationManager.isSocketConnected()) {
            return this.renderServerNotAvailable(classes);
        } else if (!this.state.dataLoaded) {
            return this.renderConnectingPage(classes);
        } else {
            return (
                <>
                    <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                        <Grid container item justify={"flex-start"} alignItems={"flex-start"}
                              xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                              className={classes.pageHeader}
                        >
                            {this.renderPageHeader(classes)}
                        </Grid>
                    </Grid>
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
                                {this.renderScene()}
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            );
        }
    }
}

export default withStyles(styles)(History);