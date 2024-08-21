import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import { BsPatchPlusFill, BsPlus } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { Col, Row, Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';


const ComplaintsContainer = styled.div`
  flex: 1;
  margin-right: 10px;
  padding: 20px;
  background-color: #b798c0; // Light brown background
  border-radius: 10px;
  text-align: center;
`;

const CenteredFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Complaints = ({ onSelectComplaints }) => {
  const [complaintsList, setComplaintsList] = useState([]);
  const [complaintsInputs, setComplaintsInputs] = useState([{ selectedComplaints: [] }]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newComplaint, setNewComplaint] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/complaints/')
      .then(response => {
        setComplaintsList(response.data);
      })
      .catch(error => {
        console.error('Error fetching complaints data:', error);
      });
  }, []);



  const handleAddNewComplaint = () => {
    axios.post('http://127.0.0.1:8000/complaints/', { complaints: newComplaint })
      .then(response => {
        setComplaintsList([...complaintsList, response.data]);
        setShowAddInput(false);
        setNewComplaint('');
        setSuccessMessage('New complaint stored successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => console.error('Error adding new complaint:', error));
  };

  const handleComplaintChange = (selected, index) => {
    const newComplaintsInputs = [...complaintsInputs];
    newComplaintsInputs[index].selectedComplaints = selected;
    setComplaintsInputs(newComplaintsInputs);
    onSelectComplaints(selected);
  };

  return (
    <ComplaintsContainer>
      {complaintsInputs.map((input, index) => (
        <Row className="justify-content-center mb-3" key={index}>
          <CenteredFormGroup as={Col} md="4" controlId={`complaints-${index}`}>
            <Form.Label>Complaints</Form.Label>
            <FlexContainer>
             
              <Typeahead
                className="ms-2"
                id={`complaints-typeahead-${index}`}
                labelKey="complaints"  // Adjust if necessary
                onChange={selected => handleComplaintChange(selected, index)}
                options={complaintsList}  // Ensure this is the correct array of objects
                placeholder="Select Complaints"
                selected={Array.isArray(input.selectedComplaints) ? input.selectedComplaints : []}
                multiple
              />
             
            </FlexContainer>
          </CenteredFormGroup>
        </Row>
      ))}

      {/* New Complaint Input Section */}
      {showAddInput && (
        <Row className="justify-content-center mb-3">
          <CenteredFormGroup as={Col} md="4">
            <Form.Label>New Complaint</Form.Label>
            <FlexContainer>
              <Form.Control
                type="text"
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                placeholder="Enter new complaint"
              />
              <Button onClick={handleAddNewComplaint} style={{ marginLeft: '10px' }}>
                Save
              </Button>
            </FlexContainer>
          </CenteredFormGroup>
        </Row>
      )}

      {/* Button to show/hide the new complaint input field */}
      <button onClick={() => setShowAddInput(!showAddInput)}>
        {showAddInput ? 'Close' : 'Add New Complaint'}
      </button>

      {successMessage && (
        <Alert variant="success" style={{ marginTop: '20px' }}>
          {successMessage}
        </Alert>
      )}

      {/* Display selected complaints */}
      {selectedComplaints.length > 0 && (
        <div>
          <h2>Selected Complaints:</h2>
          <ul>
            {selectedComplaints.map(complaint => (
              <li key={complaint.id}>{complaint.complaints}</li>
            ))}
          </ul>
        </div>
      )}
    </ComplaintsContainer>
  );
};

export default Complaints;