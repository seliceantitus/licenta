import React from 'react';
import './App.css';
import Content from "./Pages/Content";
import ErrorBoundary from "./Pages/Error/ErrorBoundary";

function App() {
    return (
        <ErrorBoundary>
            <Content/>
        </ErrorBoundary>
    );
}

export default App;
