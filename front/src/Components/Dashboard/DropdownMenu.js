import React from "react";
import {FormControl, InputLabel, MenuItem, Select, withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 140,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

class DropdownMenu extends React.Component {

    renderMenuList = (id, options) => options.map((option, index) => (
        <MenuItem value={option} key={`${id}-Step-Menu-${index}`}>{option}</MenuItem>
    ));

    render() {
        const {classes, id, initialValue, options, disabled, changeHandler} = this.props;
        return (
            <FormControl className={classes.formControl} disabled={disabled}>
                <InputLabel htmlFor="step-size-select">
                    Step increment
                </InputLabel>
                <Select
                    value={initialValue ? initialValue : ''}
                    onChange={changeHandler(id)}
                    inputProps={{
                        name: 'step-size',
                        id: 'step-size-select',
                    }}
                    className={classes.selectEmpty}
                >
                    {this.renderMenuList(id, options)}
                </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles)(DropdownMenu);