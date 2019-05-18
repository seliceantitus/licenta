import React from "react";
import PropTypes from 'prop-types';
import {Redirect} from "react-router-dom";
import {Grid, Paper, withStyles} from "@material-ui/core";

const styles = theme => ({});

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            info: null,
        };
    }

    componentDidCatch(error, info) {
        console.log(error.message);
        console.log(error.code);
        console.log(error.context);
        console.log(error.data);
        console.log(error.name);
        console.log(error.stack);
        this.setState({
            hasError: true,
            error: error,
            info: info
        });
        setInterval(() => <Redirect to={'/'}/>, 5000);
    }

    render() {
        const classes = this.props;
        if (this.state.hasError)
            return (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '100vh'}}
                >
                    <Grid item lg={8}>
                        <Paper style={{padding: 40}}>
                            Test
                        </Paper>
                    </Grid>

                </Grid>

            );
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorBoundary);