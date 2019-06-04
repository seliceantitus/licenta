import React from "react";
import {Link} from "react-router-dom";
import {Badge, ListItem, ListItemIcon, ListItemText, Tooltip} from "@material-ui/core";

class NavListLink extends React.Component {

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

    getBaseComponent = props => (
        <ListItem button component={Link} to={props.link}>
            <ListItemIcon>{this.getBaseIcon(props)}</ListItemIcon>
            <ListItemText>{props.name}</ListItemText>
        </ListItem>
    );

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

export default NavListLink;