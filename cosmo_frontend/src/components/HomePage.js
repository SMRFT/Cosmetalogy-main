import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Image1 from './images/main-background.png';

const HomePage = () => {
    return (
        <div className="homepage-container mt-2">
            <div className="links-container">
                <StyledLink to="/DoctorLogin">Doctor Login</StyledLink>
                <StyledLink to="/ReceptionistLogin">Receptionist Login</StyledLink>
                <StyledLink to="/PharmacistLogin">Pharmacist Login</StyledLink>
            </div>
            <div className="content-container">
                <div className="images-container">
                    <img src={Image1} alt="Beauty 1" />
                </div>
            </div>
        </div>
    );
};

const StyledLink = ({ to, children }) => (
    <Link to={to} className="styled-link">
        {children}
    </Link>
);

export default HomePage;
