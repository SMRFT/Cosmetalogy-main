import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Notification from './Notification';
import Logo from './images/salem-cosmetic-logo.png';
import SignOut from './SignOut';

const DoctorLoginHeader = () => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <LogoContainer>
          <img src={Logo} alt="Logo" />
        </LogoContainer>
        <Navigation>
          <NavItem>
            <StyledLink to="/Doctor/BookedAppointments">Appointments</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/Doctor/PatientDetails">Patient Details</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/Doctor/Report">Report</StyledLink>
          </NavItem>
        </Navigation>
      </HeaderLeft>
      <HeaderRight>
        <Notification />
        <SignOut />
      </HeaderRight>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
  margin-left: 60px;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: space-around;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const NavItem = styled.div`
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
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

  @media (max-width: 480px) {
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
`;

export default DoctorLoginHeader;
