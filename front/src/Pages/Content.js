import React from 'react';
import {Link, Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import Scan from "./Scan/Scan";
import History from "./History/History";
import Dashboard from "./Dash/Dashboard";
import NavigationAppBar from "./NavigationAppBar/NavigationAppBar";
import ErrorBoundary from "./Error/ErrorBoundary";
import {
    STATUS_ERROR,
    STATUS_OK,
    STATUS_WARNING,
    TOAST_ERROR,
    TOAST_INFO,
    TOAST_SUCCESS,
    TOAST_WARN
} from "../Constants/UI";
import {
    SERIAL_CONNECTION_CLOSE,
    SERIAL_CONNECTION_CLOSE_ERROR,
    SERIAL_CONNECTION_FAIL,
    SERIAL_CONNECTION_OPEN,
    SERIAL_CONNECTION_OPEN_ERROR,
    SOCKET_CONNECTING,
    SOCKET_CONNECTION_EXISTING,
    SOCKET_CONNECTION_FAIL,
    SOCKET_CONNECTION_RETRY,
    SOCKET_CONNECTION_SUCCESS,
    SOCKET_DISCONNECT,
    SOCKET_NOT_CONNECTED
} from "../Constants/Messages";
import CommunicationManager from "../Utils/CommunicationManager";
import {Slide, toast, ToastContainer} from "react-toastify";
import {
    Badge,
    CssBaseline,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    withStyles,
} from "@material-ui/core";

import {Help, ImportExport, ThreeDRotation, Usb} from "@material-ui/icons/index";
import DashboardIcon from '@material-ui/icons/Dashboard';
import HistoryIcon from '@material-ui/icons/History';


const drawerWidth = 220;

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 7 + 3,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        paddingTop: theme.spacing.unit * 3,
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: {
            textDense: true
        }
    },
    badge: {
        width: 10,
        height: 10,
    }
});

class Content extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.communicationManager = new CommunicationManager();
        this.communicationManager.createSocket();
        //Socket connected
        this.communicationManager.addConnectHandler(() => {
            this.showToast(TOAST_SUCCESS, SOCKET_CONNECTION_SUCCESS);
            this.setState({socket: {connected: true, status: STATUS_OK()}});
        });
        //Socket connecting
        this.communicationManager.addConnectingHandler(() => {
            this.showToast(TOAST_INFO, SOCKET_CONNECTING);
        });
        //Socket connection retry
        this.communicationManager.addReconnectingHandler(() => {
            this.showToast(TOAST_WARN, SOCKET_CONNECTION_RETRY);
            this.setState({socket: {connected: false, status: STATUS_WARNING(true)}});
        });
        //Socket connection failed
        this.communicationManager.addReconnectFailedHandler(() => {
            this.showToast(TOAST_ERROR, SOCKET_CONNECTION_FAIL);
            this.setState({socket: {connected: false, status: STATUS_ERROR()}});
        });
        //Socket disconnecting
        this.communicationManager.addDisconnectHandler(() => {
            this.showToast(TOAST_ERROR, SOCKET_DISCONNECT);
            this.setState({socket: {connected: false, status: STATUS_ERROR()}});
        });

        //Serial connected
        this.communicationManager.addSerialConnectHandler(() => {
            this.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_OPEN);
            this.setState({serial: {connected: true, status: STATUS_OK(true)}});
        });

        //Serial connect failed
        this.communicationManager.addSerialConnectErrorHandler((error) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_OPEN_ERROR} ${error}`);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        });

        //Serial disconnect
        this.communicationManager.addSerialDisconnectHandler(() => {
            this.showToast(TOAST_SUCCESS, SERIAL_CONNECTION_CLOSE);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        });

        //Serial disconnect failed
        this.communicationManager.addSerialDisconnectErrorHandler((error) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_CLOSE_ERROR} ${error}`);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        });

        //Serial error
        this.communicationManager.addSerialErrorHandler((error) => {
            this.showToast(TOAST_ERROR, `${SERIAL_CONNECTION_FAIL} ${error}`);
            this.setState({serial: {connected: false, status: STATUS_ERROR()}});
        });

        this.state = {
            open: false,
            socket: {
                connected: false,
                status: STATUS_ERROR()
            },
            serial: {
                connected: false,
                status: STATUS_ERROR()
            },
        };

        this.showToast = (type, message) => {
            toast(message, {type: type, containerId: 'Content'})
        };
    }

    componentWillUnmount() {
        if (this.state.serial.connected) this.communicationManager.closeSerial();
        if (this.state.socket.connected) this.communicationManager.closeSocket()
    }

    handleSocketClick = () => {
        if (this.state.socket.connected) {
            this.showToast(TOAST_INFO, SOCKET_CONNECTION_EXISTING);
        } else {
            this.communicationManager.openSocket();
        }
    };

    handleSerialClick = () => {
        if (!this.state.socket.connected) {
            this.showToast(TOAST_ERROR, SOCKET_NOT_CONNECTED);
        } else {
            if (this.state.serial.connected) {
                this.communicationManager.closeSerial();
            } else {
                this.setState({serial: {...this.state.serial, status: STATUS_WARNING(true)}});
                this.communicationManager.openSerial();
            }
        }
    };

    renderMenuList = () => (
        <List>
            <ListItem button component={Link} to={'/'}>
                <ListItemIcon><DashboardIcon/></ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
            </ListItem>
            <ListItem button component={Link} to={'/scan'}>
                <ListItemIcon><ThreeDRotation/></ListItemIcon>
                <ListItemText>Scan</ListItemText>
            </ListItem>
            <ListItem button component={Link} to={'/history'}>
                <ListItemIcon><HistoryIcon/></ListItemIcon>
                <ListItemText>
                    History
                </ListItemText>
            </ListItem>
            <Divider/>
            <Tooltip
                title={this.state.socket.connected ? "Socket" : "Click to connect"}
                placement="right"
            >
                <ListItem button onClick={this.handleSocketClick}>
                    <ListItemIcon>
                        {this.state.socket.connected ?
                            <ImportExport color={'action'}/>
                            :
                            <Badge badgeContent={'!'} color="secondary" variant={"dot"}>
                                <ImportExport color={'action'}/>
                            </Badge>
                        }
                    </ListItemIcon>
                    <ListItemText>
                        Socket
                    </ListItemText>
                    <ListItemIcon>
                        {this.state.socket.status}
                    </ListItemIcon>
                </ListItem>
            </Tooltip>
            <Tooltip
                title={this.state.serial.connected ? "Click to disconnect" : "Click to connect"}
                placement="right"
            >
                <ListItem button onClick={this.handleSerialClick}>
                    <ListItemIcon>
                        {this.state.serial.connected ?
                            <Usb color={'action'}/>
                            :
                            <Badge badgeContent={'!'} color="secondary" variant={"dot"}>
                                <Usb color={'action'}/>
                            </Badge>
                        }
                    </ListItemIcon>
                    <ListItemText>
                        Serial
                    </ListItemText>
                    <ListItemIcon>
                        {this.state.serial.status}
                    </ListItemIcon>
                </ListItem>
            </Tooltip>
            <Divider/>
            <ListItem button>
                <ListItemIcon><Help/></ListItemIcon>
                <ListItemText>Help</ListItemText>
            </ListItem>
        </List>
    );

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <ToastContainer enableMultiContainer autoClose={3000} pauseOnHover={false} transition={Slide}
                                pauseOnFocusLoss={false} containerId={'Content'}/>
                <NavigationAppBar>
                    {this.renderMenuList(classes)}
                </NavigationAppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <ErrorBoundary>
                        <Switch>
                            <Route exact path={'/'}
                                   component={() => <Dashboard communicationManager={this.communicationManager}/>}
                            />
                            <Route path={'/scan'}
                                   component={() => <Scan communicationManager={this.communicationManager}/>}
                            />
                            <Route path={'/history'}
                                   component={() => <History communicationManager={this.communicationManager}/>}
                            />
                        </Switch>
                    </ErrorBoundary>
                </main>
            </div>
        );
    }
}

Content.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Content);
