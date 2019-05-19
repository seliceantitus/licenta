import React from "react";
import {Menu} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem/index";
import {Check} from "@material-ui/icons/index";

class NavListMenu extends React.Component {
    render() {
        const {id, data, anchorEl, closeHandler, itemSelectHandler, selected} = this.props;
        return (
            <Menu id={id}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={closeHandler}
            >
                {data.map((item, index) => (
                    <MenuItem value={item} key={`${id}-Item-${index}`} onClick={() => itemSelectHandler(item)}>
                        {selected === item ? <>{item} <Check/> </> : item}
                    </MenuItem>
                ))}
            </Menu>
        );
    }
}

export default NavListMenu;