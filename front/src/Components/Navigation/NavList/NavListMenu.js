import React from "react";
import {Menu, MenuItem} from "@material-ui/core";
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
                {data.length > 0 ?
                    data.map((item, index) => (
                        <MenuItem value={item} key={`${id}-Item-${index}`} onClick={() => itemSelectHandler(item)}>
                            {selected === item ? <>{item} <Check/> </> : item}
                        </MenuItem>))
                    :
                    <MenuItem value={'None'} disabled>
                        None
                    </MenuItem>
                }
            </Menu>
        );
    }
}

export default NavListMenu;