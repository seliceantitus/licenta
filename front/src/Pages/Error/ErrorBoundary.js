import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        console.log(error, info);
        this.setState({hasError: true});
    }

    render() {
        if(this.state.hasError) return <div>Error!</div>;
        return this.props.children;
    }
}

export default ErrorBoundary;