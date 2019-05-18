import React from "react";

class History extends React.Component {

    constructor(props) {
        super(props);

        console.log('[HIST] Const');
    }


    render() {
        return (
            <div>
                <h1>History</h1>
            </div>
        );
    }
}

export default History;