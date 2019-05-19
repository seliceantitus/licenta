import React from "react";
import {Badge, Divider, ListItem, ListItemIcon, ListItemText, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Dashboard, Help, History, ImportExport, ThreeDRotation, Usb} from "@material-ui/icons/index";
import {MENU_CONNECTION_BUTTON, MENU_DIVIDER, MENU_LINK} from "../../Constants/UI";

class Menu extends React.Component {

    wrapWithAlertBadge = (component, index) => (
        <Badge badgeContent={'!'} color="secondary" variant={"dot"} key={`List-badge-${index}`}>
            {component}
        </Badge>
    );

    wrapWithTooltip = (component, tooltip, index) => (
        <Tooltip title={tooltip} placement="right" key={`List-tooltip-${index}`}>
            {component}
        </Tooltip>
    );

    createMenuLink = (item, index) => (
        <ListItem button component={Link} to={item.link} key={`List-link-button-${index}`}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
        </ListItem>
    );

    createConnectionButton = (item, index) => {
        let component =
            <ListItem button onClick={item.handler} key={`List-connection-button-${index}`}>
                <ListItemIcon>
                    {item.connected ? item.icon : this.wrapWithAlertBadge(item.icon, index)}
                </ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
                <ListItemIcon>{item.status}</ListItemIcon>
            </ListItem>;
        component = this.wrapWithTooltip(component, item.tooltip[item.connected], index);
        return component;
    };

    render() {
        const items = [
            {name: 'Dashboard', type: MENU_LINK, link: '/', icon: <Dashboard/>},
            {name: 'Scan', type: MENU_LINK, link: '/scan', icon: <ThreeDRotation/>},
            {name: 'History', type: MENU_LINK, link: '/history', icon: <History/>},
            {type: MENU_DIVIDER},
            {
                name: 'Socket',
                connected: this.props.socket.connected,
                type: MENU_CONNECTION_BUTTON,
                tooltip: {true: "Socket", false: "Click to connect"},
                icon: <ImportExport color={"action"}/>,
                status: this.props.socket.status,
                handler: this.props.socketHandler,
            },
            {
                name: 'Serial',
                connected: this.props.serial.connected,
                type: MENU_CONNECTION_BUTTON,
                tooltip: {true: "Click to disconnect", false: "Click to connect"},
                icon: <Usb color={"action"}/>,
                status: this.props.serial.status,
                handler: this.props.serialHandler,
            },
            {type: MENU_DIVIDER},
            {name: 'Help', type: MENU_LINK, link: '/help', icon: <Help/>},
        ];

        return (
            items.map((item, index) => {
                switch (item.type) {
                    case MENU_DIVIDER:
                        return (<Divider key={`List-divider-${index}`}/>);
                    case MENU_LINK:
                        return this.createMenuLink(item, index);
                    case MENU_CONNECTION_BUTTON:
                        return this.createConnectionButton(item, index);
                    default:
                        return null
                }
            })
        );
    }
}

export default Menu;