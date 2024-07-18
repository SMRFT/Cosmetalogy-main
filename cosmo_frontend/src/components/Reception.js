import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './images/salem-cosmetic-logo.png';
import './Reception.css';
import PatientDetails from './PatientDetails'; // Import the PatientDetails component
import Appointment from './Appointments';
import Bill from './Bill';

const Reception = () => {
  return (
    <div>
      <Header>
        <HeaderLeft>
          <LogoContainer>
            <img src={Logo} alt="Logo" />
          </LogoContainer>
          <Navigation>
            <NavItem>
              <StyledLink to="Appointment">Book Appointments</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="PatientDetails">Patient Details</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="Bill">Bill</StyledLink>
            </NavItem>
          </Navigation>
        </HeaderLeft>
      </Header>

      <Content>
        <Routes>
          <Route path="Appointment" element={<Appointment />} />
          <Route path="PatientDetails" element={<PatientDetails />} />
          <Route path="Bill" element={<Bill />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Default route */}
        </Routes>
      </Content>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background: white; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 6px 0; 
  z-index: 1000; /* Ensure header is above other elements */
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  img {
    max-width: 95%; /* Adjust as necessary */
    height: auto;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
  margin-left: 60px; /* Add some space between the logo and navigation */
`;

const NavItem = styled.div`
  font-size: 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: rgb(111, 136, 132);
  font-size: 1.2rem;
  margin: 0 15px;
  display: inline-block;
  transition: color 0.3s, font-size 0.3s;
  font-family: initial;

  &:hover {
    color: #CCB268;
    font-size: 1.4rem;
  }
`;

const Content = styled.div`
  margin-top: 80px; /* Adjust based on the height of your header */
  padding: 20px;
`;

export default Reception;
