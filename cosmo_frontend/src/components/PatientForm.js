import React, { useState } from 'react';
import { Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import './PatientForm.css'; // Import the CSS file

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

  return (
    <Container className="form-container">
      <Form onSubmit={handleSubmit}>
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
              <Form.Label>Email</Form.Label>
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
            <Form.Group controlId="purposeOfVisit">
              <Form.Label>Purpose Of Visit</Form.Label>
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
            <Form.Group controlId="bloodGroup">
              <Form.Label>Blood Group</Form.Label>
              <Form.Select
                as="select"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="custom-input"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="language">
              <Form.Label>Preferred Language</Form.Label>
              <Form.Select
                as="select"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="custom-input"
              >
                <option value="">Select Language</option>
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </Form.Select>
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
                rows={3}
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
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <button type="submit">
          Submit
        </button>
      </Form>
    </Container>
  );
};

export default PatientForm;
