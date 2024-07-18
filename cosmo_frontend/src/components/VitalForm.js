import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function VitalForm({ patientName, mobileNumber }) {
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        pulseRate: '',
        bloodPressure: '',
        patientName: patientName,
        mobileNumber: mobileNumber
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted: ', formData);
        try {
            const vitalResponse = await axios.post('http://127.0.0.1:8000/vitalform/', {
                height: formData.height,
                weight: formData.weight,
                pulseRate: formData.pulseRate,
                bloodPressure: formData.bloodPressure,
                patient: formData.mobileNumber // Link the vital record to the patient using mobileNumber
            });

            console.log('Vital Data:', vitalResponse.data);
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    return (
        <FormContainer>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                        type="text"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="pulseRate">Pulse Rate (bpm)</Label>
                    <Input
                        type="text"
                        id="pulseRate"
                        name="pulseRate"
                        value={formData.pulseRate}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input
                        type="text"
                        id="bloodPressure"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        placeholder="e.g., 120/80"
                        required
                    />
                </FormGroup>
            </Form>
            <button type="submit">
                Submit
            </button>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #F7F7F7;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
`;

export default VitalForm;
