import React from 'react';
import './App.css';
import Main from "./Components/Main";
import {Slide, ToastContainer} from "react-toastify";

function App() {
    return (
        <>
            <ToastContainer
                autoClose={3000}
                pauseOnHover={false}
                transition={Slide}
                pauseOnFocusLoss={false}
            />
            <Main/>
        </>
    );
}

export default App;
