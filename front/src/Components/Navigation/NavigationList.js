import React from "react";
import {Divider} from "@material-ui/core";
import {Dashboard, DeviceHub, Help, History, ImportExport, ThreeDRotation, Usb} from "@material-ui/icons/index";
import {NAV_BUTTON, NAV_DIVIDER, NAV_LINK, NAV_MENU} from "../../Constants/UI";
import NavListLink from "./NavList/NavListLink";
import NavListButton from "./NavList/NavListButton";
import NavListMenu from "./NavList/NavListMenu";

class NavigationList extends React.Component {

    constructor(props) {
        super(props);
        console.log('[NAV LIST] Constructed');
        this.state = {
            port: '',
            anchorElement: null,
        };
    }

    handleMenuOpen = event => {
        this.setState({anchorElement: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorElement: null});
    };

    handleMenuItemSelect = (port, handler) => {
        if (port) {
            this.setState({port: port, anchorElement: null});
        }
    };

    render() {
        const {socketHandler, serialHandler, serialPortsHandler} = this.props;
        const items = [
            {name: 'Dashboard', type: NAV_LINK, link: '/', icon: <Dashboard/>},
            {name: 'Scan', type: NAV_LINK, link: '/scan', icon: <ThreeDRotation/>},
            {name: 'History', type: NAV_LINK, link: '/history', icon: <History/>},
            {type: NAV_DIVIDER},
            {
                name: 'Socket',
                type: NAV_BUTTON,
                handler: socketHandler,
                icon: <ImportExport color={"action"}/>,
                connected: this.props.socket.connected,
                status: this.props.socket.status,
                tooltip: {true: "Socket", false: "Click to connect"},
            },
            {
                name: 'Serial',
                type: NAV_BUTTON,
                handler: serialHandler,
                icon: <Usb color={"action"}/>,
                connected: this.props.serial.connected,
                status: this.props.serial.status,
                tooltip: {true: "Click to disconnect", false: "Click to connect"},
            },
            {
                name: 'COM Port',
                type: NAV_MENU,
                handler: serialPortsHandler,
                data: this.props.serialPorts,
                icon: <DeviceHub color={"action"}/>,
            },
            {type: NAV_DIVIDER},
            {name: 'Help', type: NAV_LINK, link: '/help', icon: <Help/>},
        ];
        return (
            items.map((item, index) => {
                switch (item.type) {
                    case NAV_DIVIDER:
                        return (
                            <Divider key={`List-divider-${index}`}/>
                        );
                    case NAV_LINK:
                        return (
                            <NavListLink
                                name={item.name}
                                link={item.link}
                                icon={item.icon}
                                tooltip={item.name}
                                key={`MenuLink-${index}`}
                            />
                        );
                    case NAV_BUTTON:
                        return (
                            <NavListButton
                                name={item.name}
                                icon={item.icon}
                                secondaryIcon={item.status}
                                badge={!item.connected}
                                tooltip={item.tooltip[item.connected]}
                                handler={item.handler}
                                key={`MenuButton-${index}`}
                            />
                        );
                    case NAV_MENU:
                        return (
                            <React.Fragment key={`Fragment-Menu-${index}`}>
                                <NavListButton
                                    name={item.name}
                                    icon={item.icon}
                                    tooltip={'Click to select COM port'}
                                    handler={(event) => this.handleMenuOpen(event)}
                                    hasPopup
                                    owns={'COM-Menu'}
                                />
                                <NavListMenu
                                    id={'COM-Menu'}
                                    data={item.data}
                                    anchorEl={this.state.anchorElement}
                                    closeHandler={this.handleMenuClose}
                                    itemSelectHandler={(port) => {
                                        item.handler(port);
                                        this.handleMenuItemSelect(port);
                                    }}
                                    selected={this.state.port}
                                />
                            </React.Fragment>
                        );
                    default:
                        return null
                }
            })
        );
    }
}

export default NavigationList;