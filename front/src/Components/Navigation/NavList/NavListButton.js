import React from "react";
import {Badge, ListItemIcon, ListItemText} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem/index";
import Tooltip from "@material-ui/core/Tooltip/index";

class NavListButton extends React.Component {

    getBaseIcon = props => {
        if (props.badge) {
            return (
                <Badge badgeContent={'!'} color="secondary" variant={"dot"}>
                    {props.icon}
                </Badge>);
        } else {
            return props.icon;
        }
    };

    getBaseComponent = props => {
        const {handler, name, secondaryIcon} = props;
        return (
            <ListItem button onClick={handler}>
                <ListItemIcon>{this.getBaseIcon(props)}</ListItemIcon>
                <ListItemText>{name}</ListItemText>
                {secondaryIcon ? secondaryIcon : null}
            </ListItem>
        );
    };

    render() {
        const {tooltip} = this.props;
        const component = this.getBaseComponent(this.props);
        if (tooltip) {
            return (
                <Tooltip title={tooltip} placement="right">
                    {component}
                </Tooltip>
            )
        } else {
            return component;
        }
    }

}

export default NavListButton;