import React, { useState } from 'react';
import { Form, Container, Row, Col, Alert, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import './PatientForm.css'; // Import the CSS file
import styled from 'styled-components';
import VitalForm from './VitalForm'; // Import VitalForm

// Import images
import maleIcon from './images/male-gender.png';
import femaleIcon from './images/femenine.png';
import transgenderIcon from './images/transgender.png';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    bloodGroup: '',
    language: '',
    purposeOfVisit: '',
    address: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenderSelect = (gender) => {
    setFormData({ ...formData, gender });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    axios.post('http://127.0.0.1:8000/Patients_data/', formData)
      .then(response => {
        setSuccessMessage('Patient Data Added Successfully');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.mobileNumber) {
          setErrorMessage('A patient with this mobile number already exists.');
        } else {
          setErrorMessage('There was an error submitting the form.');
        }
        console.error('There was an error submitting the form:', error);
      });
  };

  const handleModalOpen = () => setShowModal(true); // Open modal
  const handleModalClose = () => setShowModal(false); // Close modal

  return (
    <Container className="form-container">
      <VitalFormIcon className='mt-2' title='Vital Form' onClick={handleModalOpen}>
      <LiaFileMedicalAltSolid />
      </VitalFormIcon>
      <br/>
      <Form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        <Row>
          <Col>
            <Form.Group controlId="patientName">
              <Form.Label>Patient Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="mobileNumber">
              <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Group controlId="dateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="gender">
              <Form.Label>Select Gender <span className="text-danger">*</span></Form.Label>
              <div className="gender-selection">
                <div className="gender-icons">
                  <div onClick={() => handleGenderSelect('Male')} className={`gender-option ${formData.gender === 'Male' ? 'selected' : ''}`}>
                    <img
                      src={maleIcon}
                      alt="Male"
                      className="gender-icon"
                    />
                    <div>Male</div>
                  </div>
                  <div onClick={() => handleGenderSelect('Female')} className={`gender-option ${formData.gender === 'Female' ? 'selected' : ''}`}>
                    <img
                      src={femaleIcon}
                      alt="Female"
                      className="gender-icon"
                    />
                    <div>Female</div>
                  </div>
                  <div onClick={() => handleGenderSelect('Unspecified')} className={`gender-option ${formData.gender === 'Unspecified' ? 'selected' : ''}`}>
                    <img
                      src={transgenderIcon}
                      alt="Unspecified"
                      className="gender-icon"
                    />
                    <div>Unspecified</div>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="bloodGroup">
              <Form.Label>Blood Group</Form.Label>
              <Form.Control
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="purposeOfVisit">
              <Form.Label>Purpose of Visit <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="purposeOfVisit"
                value={formData.purposeOfVisit}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <button type="submit" className="custom-button">Submit</button>
          </Col>
        </Row>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
      </Form>
      {/* Modal for VitalForm */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vital Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VitalForm patientName={formData.patientName} mobileNumber={formData.mobileNumber} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const VitalFormIcon = styled.div`
  position: absolute;
  top: 5px;
  right: 25px;
  cursor: pointer;
  font-size: 2.5rem;
  color: black;
`
export default PatientForm;
