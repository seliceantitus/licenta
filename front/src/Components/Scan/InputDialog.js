import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

class InputDialog extends React.Component {

    state = {
        value: null
    };

    handleChanged = event => {
        this.setState({value: event.target.value})
    };

    render() {
        const {open, title, body, okButtonText, cancelButtonText, okHandler, cancelHandler} = this.props;
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

export default InputDialog;