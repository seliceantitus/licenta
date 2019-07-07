import React from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import {DEFAULT_MD_COL_WIDTH, DEFAULT_XS_COL_WIDTH} from "../../Constants/UI";

class Help extends React.Component {
    constructor(props) {
        super(props);
    }

    renderFAQ = () => {
        return Array(10).fill(10).map((val, index) => (
            <ExpansionPanel key={`Expansion-Panel=${index}`}>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Typography>Question {index}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>Body {index}</ExpansionPanelDetails>
            </ExpansionPanel>
        ));
    };

    render() {
        return (
            <Grid container justify={"center"} alignItems={"flex-start"} spacing={2} direction={"row"}>
                <Grid container item direction={"column"} justify={"center"} alignItems={"stretch"} spacing={2}
                      xs={DEFAULT_XS_COL_WIDTH} md={DEFAULT_MD_COL_WIDTH} lg={10} xl={10}
                >
                    <Paper style={{padding: 20}}>
                        {this.renderFAQ()}
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default Help;