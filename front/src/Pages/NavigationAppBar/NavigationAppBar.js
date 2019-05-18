import React from "react";
import {AppBar, Divider, Drawer, IconButton, Toolbar, Typography, withStyles} from "@material-ui/core";
import classNames from "classnames";
import {ChevronLeft, Menu} from "@material-ui/icons/index";

const drawerWidth = 220;

const styles = theme => ({
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
});

class NavigationAppBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
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

    renderDrawer = (classes) => (
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
            {this.props.children}
        </Drawer>
    );

    render() {
        const {classes} = this.props;
        return (
            <>
                {this.renderAppBar(classes)}
                {this.renderDrawer(classes)}
            </>
        );
    }
}

export default withStyles(styles, {withTheme: true})(NavigationAppBar);