import React from "react";

class Help extends React.Component {
    constructor(props) {
        super(props);
        console.log('[HELP] Constructed');
    }

    componentWillUnmount() {
        console.log('[HELP] Unmount');
    }

    render() {
        return (
            <div>
                Help
            </div>
        );
    }
}

export default Help;