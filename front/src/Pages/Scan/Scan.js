import React from "react";

class Scan extends React.Component {
    constructor(props) {
        super(props);

        this.socket = this.props.socket;
    }

    render() {
        return (
            <div>
                <h1>Scan</h1>
            </div>
        );
    }
}

export default Scan;