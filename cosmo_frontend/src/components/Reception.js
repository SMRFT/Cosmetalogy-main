import React from 'react';
import { Link } from 'react-router-dom';
import appointmentIcon from './images/appointment.png';
import detailsIcon from './images/details.png';
import './Reception.css';

const Reception = () => {
    return (
        <div className="reception-container">
            <div className="button-container">
                <Link to="/Appointment" style={{textDecoration: "none"}}>
                    <div className="icon-container">
                        <img src={appointmentIcon} alt="appointment" className="appointment-icon" />
                        <div className="icon-label">Create Appointment</div>
                    </div>
                </Link>
                <Link to="/Receptionist/PatientDetails" style={{textDecoration: "none"}}>
                    <div className="icon-container">
                        <img src={detailsIcon} alt="Details" className="details-icon" />
                        <div className="icon-label">Patient Details</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Reception;
