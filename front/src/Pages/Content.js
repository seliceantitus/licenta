import React from 'react';
import {Link, Route, Switch} from "react-router-dom";
import classNames from 'classnames';
import PropTypes from "prop-types";

import Scan from "./Scan/Scan";
import History from "./History/History";
import Dashboard from "./Dash/Dashboard";
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
    SOCKET_CONNECTING,
    SOCKET_CONNECTION_EXISTING,
    SOCKET_CONNECTION_FAIL,
    SOCKET_CONNECTION_RETRY,
    SOCKET_CONNECTION_SUCCESS,
    SOCKET_DISCONNECT,
    SOCKET_NOT_CONNECTED
} from "../Constants/Messages";
import ConnectionManager from "../Utils/ConnectionManager";
import {Slide, toast, ToastContainer} from "react-toastify";
import {
    AppBar,
    Badge,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from "@material-ui/core";

import {ChevronLeft, Help, ImportExport, Menu, ThreeDRotation, Usb} from "@material-ui/icons/index";
import DashboardIcon from '@material-ui/icons/Dashboard';
import HistoryIcon from '@material-ui/icons/History';

const drawerWidth = 220;

const styles = theme => ({
    root: {
        display: 'flex',
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

        this.connectionManager = new ConnectionManager();
        this.connectionManager.createSocket();
        this.connectionManager.addConnectHandler(() => {
            this.showToast(TOAST_SUCCESS, SOCKET_CONNECTION_SUCCESS);
            this.setState({
                socket: {
                    connected: true,
                    status: STATUS_OK()
                }
            });
        });
        this.connectionManager.addConnectingHandler(() => {
            this.showToast(TOAST_INFO, SOCKET_CONNECTING);
        });
        this.connectionManager.addReconnectingHandler(() => {
            this.showToast(TOAST_WARN, SOCKET_CONNECTION_RETRY);
            this.setState({
                socket: {
                    connected: false,
                    status: STATUS_WARNING(true)
                }
            });
        });
        this.connectionManager.addReconnectFailedHandler(() => {
            this.showToast(TOAST_ERROR, SOCKET_CONNECTION_FAIL);
            this.setState({
                socket: {
                    connected: false,
                    status: STATUS_ERROR()
                }
            });
        });
        this.connectionManager.addDisconnectHandler(() => {
            this.showToast(TOAST_ERROR, SOCKET_DISCONNECT);
            this.setState({
                socket: {
                    connected: false,
                    status: STATUS_ERROR()
                }
            })
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
            toast(message, {type: type})
        };
    }

    componentWillUnmount() {
        if (this.state.serial.connected) this.connectionManager.closeSerial();
        if (this.state.socket.connected) this.connectionManager.closeSocket()
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleSocketClick = () => {
        if (this.state.socket.connected) {
            this.showToast(TOAST_INFO, SOCKET_CONNECTION_EXISTING);
        } else {
            this.connectionManager.openSocket();
        }
    };

    handleSerialClick = () => {
        if (!this.state.socket.connected) {
            this.showToast(TOAST_ERROR, SOCKET_NOT_CONNECTED);
        } else {
            if (this.state.serial.connected) {
                this.connectionManager.closeSerial();
            } else {
                this.setState({serial: {connected: false, status: STATUS_WARNING(true)}});
                this.connectionManager.openSerial();
            }
        }
    };

    renderAppBar = (classes) => (
        <AppBar position="fixed" className={classNames(classes.appBar, {[classes.appBarShift]: this.state.open,})}>
            <Toolbar disableGutters={!this.state.open}>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerOpen}
                    className={classNames(classes.menuButton, {[classes.hide]: this.state.open,})}
                >
                    <Menu/>
                </IconButton>
                <Typography variant="h6" color="inherit" noWrap>
                    3Duino
                </Typography>
            </Toolbar>
        </AppBar>
    );

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
                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable
                    transition={Slide}
                    position={'top-right'}
                    pauseOnFocusLoss={false}
                />
                {this.renderAppBar(classes)}
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeft/>
                        </IconButton>
                    </div>
                    <Divider/>
                    {this.renderMenuList(classes)}
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route exact path={'/'}
                               component={() => <Dashboard socket={this.connectionManager.getSocket()}
                                                           drawerState={this.state.open}/>}/>
                        <Route path={'/scan'}
                               component={() => <Scan socket={this.connectionManager.getSocket()}/>}/>
                        <Route path={'/history'}
                               component={() => <History socket={this.connectionManager.getSocket()}/>}/>
                    </Switch>
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
