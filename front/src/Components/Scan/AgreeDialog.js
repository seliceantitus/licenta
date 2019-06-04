import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from "@material-ui/core";

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