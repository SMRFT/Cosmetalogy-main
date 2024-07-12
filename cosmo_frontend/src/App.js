import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Logo from '../src/components/images/salem-cosmetic-logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DoctorLogin, PharmacistLogin, ReceptionistLogin } from './components/Login';
import Pharmacy from './components/Pharmacy';
import Reception from './components/Reception';
import Doctor from './components/Doctor';
import HomePage from './components/HomePage';
import PatientDetails from './components/PatientDetails';
import Appointment from './components/Appointments';
import BookedAppointments from './components/BookedAppointments';
import Prescription from './components/Prescription';
import Report from './components/Report';
import SignOut from './components/SignOut';

function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
  }, [location]);

  const isLoggedIn = userRole !== null;
  const shouldShowSignOut = isLoggedIn && !['/', '/PharmacistLogin', '/DoctorLogin', '/Doctor/*','/ReceptionistLogin'].includes(location.pathname);

  return (
    <div className="App">
      <div className="logo-container">
        <img src={Logo} alt="Shanmuga Hospital Logo" className="logo" />
        {shouldShowSignOut && <SignOut />}
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/PharmacistLogin" element={<PharmacistLogin setUserRole={setUserRole} />} />
          <Route path="/DoctorLogin" element={<DoctorLogin setUserRole={setUserRole} />} />
          <Route path="/ReceptionistLogin" element={<ReceptionistLogin setUserRole={setUserRole} />} />
          <Route path="/Pharmacy" element={<Pharmacy />} />
          <Route path="/Appointment" element={<Appointment />} />
          <Route path="/BookedAppointments" element={<BookedAppointments />} />
          <Route path="/Prescription" element={<Prescription />} />
          {/* <Route path="/Report" element={<Report />} /> */}

          {/* Doctor routes */}
          <Route path="/Doctor/*" element={isLoggedIn ? <Doctor appointments={[]} /> : <Navigate to="/" />} />

          {/* Receptionist routes */}
          <Route path="/Reception/*" element={isLoggedIn ? <Reception /> : <Navigate to="/" />} />

          {/* PatientDetails routes */}
          <Route path="/Doctor/PatientDetails" element={<PatientDetails />} />
          <Route path="/Doctor/Report" element={<Report />} />
          <Route path="/Receptionist/PatientDetails" element={<PatientDetails />} />

          {/* Default redirections */}
          {isLoggedIn && (
            <>
              <Route path="/DoctorLogin/*" element={<Navigate to="/Doctor/PatientDetails" />} />
              <Route path="/ReceptionistLogin/*" element={<Navigate to="/Receptionist/PatientDetails" />} />
            </>
          )}

          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
