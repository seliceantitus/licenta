import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

class AgreeDialog extends React.Component {

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
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelHandler} color="primary">
                        {cancelButtonText}
                    </Button>
                    <Button onClick={okHandler} color="primary">
                        {okButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AgreeDialog;