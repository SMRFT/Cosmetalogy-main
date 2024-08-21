import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Notification from './Notification';
import Logo from './images/salem-cosmetic-logo.png';
import SignOut from './SignOut';

const ReceptionistLoginHeader = () => {
  return (
    <>
    <TopContainer>
      <HeaderRight>
          <Notification />
          <SignOut />
        </HeaderRight>
      </TopContainer>
    <HeaderContainer>
      <HeaderLeft>
        <LogoContainer>
          <img src={Logo} alt="Logo" />
        </LogoContainer>
        <Navigation>
          <NavItem>
            <StyledNavLink to="/Reception/Appointment">Book Appointments</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/Reception/PatientDetails">Patient Details</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/Reception/Bill">Bill</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/Reception/ProcedureBill">Procedure Bill</StyledNavLink>
          </NavItem>
        </Navigation>
      </HeaderLeft>
    </HeaderContainer>
    </>
  );
};

const TopContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: radial-gradient(circle, #ad97b4 0%, #725F83 100%);
  z-index: 1001;
  padding: 0 15px;
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 50px; /* Position it right below the TopContainer */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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


const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #766087;
  font-size: 1.3rem;
  margin: 0 15px;
  display: inline-block;
  transition: color 0.3s, transform 0.3s;
  font-family: initial;

  &.active {
    font-size: 1.4rem; /* Increase font size when active */
    font-weight: bold;
    color: #9a85aa;
  }

  &:hover {
    transform: scale(1.1);
    color: #9a85aa;
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
export default ReceptionistLoginHeader;
