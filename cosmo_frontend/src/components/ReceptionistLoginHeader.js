import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './images/salem-cosmetic-logo.png';

const ReceptionistLoginHeader = () => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <LogoContainer>
          <img src={Logo} alt="Logo" />
        </LogoContainer>
        <Navigation>
          <NavItem>
            <StyledLink to="/Reception/Appointment">Book Appointments</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/Reception/PatientDetails">Patient Details</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/Reception/Bill">Bill</StyledLink>
          </NavItem>
        </Navigation>
      </HeaderLeft>
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
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
  margin-left: 60px;
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

export default ReceptionistLoginHeader;
