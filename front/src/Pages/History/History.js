import React from "react";
import {Grid, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";


class History extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <Paper>
                    <Typography variant={"h1"}>
                        History
                    </Typography>
                </Paper>
            </Grid>
        );
    }
}

export default History;