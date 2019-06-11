import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    TextField, withStyles
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";

const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

class InputDialog extends React.Component {

    state = {
        value: null
    };

    handleChanged = event => {
        this.setState({value: event.target.value})
    };

    render() {
        const {open, title, body, okButtonText, cancelButtonText, okHandler, cancelHandler, closeHandler, classes} = this.props;
        return (
            <Dialog
                open={open}
                TransitionComponent={Slide}
                keepMounted
                aria-labelledby="Dialog-Title"
                aria-describedby="Dialog-Body"
            >
                <DialogTitle id="Dialog-Title">
                    {title}
                    <IconButton aria-label="Close" onClick={closeHandler} className={classes.closeButton}>
                        <Close/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="Dialog-Body">
                        {body}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Scan name"
                        type="text"
                        fullWidth
                        onChange={this.handleChanged}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            cancelHandler(null);
                            this.setState({value: null})
                        }} color="primary"
                    >
                        {cancelButtonText}
                    </Button>
                    <Button disabled={!this.state.value}
                            onClick={() => {
                                okHandler(this.state.value);
                                this.setState({value: null})
                            }} color="primary"
                    >
                        {okButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(InputDialog);