import React from "react";
import { Spinner } from 'react-bootstrap'


const Spinners = () => {


    return (
        <div className = 'loader'>

            <Spinner animation="border" variant="primary" />
            <Spinner animation="border" variant="secondary" />
            <Spinner animation="border" variant="success" />
            <Spinner animation="border" variant="danger" />
            <Spinner animation="border" variant="warning" />
            <Spinner animation="border" variant="info" />
            <Spinner animation="border" variant="dark" />
           
        </div>

    );
};

export default Spinners;
