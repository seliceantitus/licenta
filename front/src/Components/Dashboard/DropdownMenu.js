import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core";
import Input from "@material-ui/core/Input";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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
                <InputLabel shrink htmlFor="age-label-placeholder">
                    Step increment
                </InputLabel>
                <Select
                    value={initialValue}
                    onChange={changeHandler(id)}
                    input={<Input name="age" id="age-label-placeholder"/>}
                    displayEmpty
                    name="age"
                    className={classes.selectEmpty}
                >
                    {this.renderMenuList(id, options)}
                </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles)(DropdownMenu);