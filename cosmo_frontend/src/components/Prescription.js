import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Form, Tab, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { diagnosisList, patientComplaints, findingsList, prescription, test } from './constant';
import male from './images/male.png';
import female from './images/female.png';
import { BsPatchPlusFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

const SectionTitle = styled.h4`
  margin-top: 20px;
  text-align: center;
`;
const PatientDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  padding: 20px;
  width: 300px; /* Set a fixed width for the container */
  height: auto;
  margin: 0;
  position: absolute;
  top: 3;
  left: 0;
  bottom: 3;
  margin-bottom: 100px; /* Adjust margin bottom as needed */
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const PatientName = styled.h5`
  margin: 0;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
`;

const PatientText = styled.p`
  margin: 0;
  color: gray;
  text-align: left;
  width: 100%;
`;

// Scrollable right content
const RightContent = styled.div`
  margin-left: 320px; /* Make space for the fixed left container */
  padding: 20px;
  overflow-y: auto; /* Allow vertical scrolling */
  height: 100vh; /* Full height of viewport */
`;

const CenteredFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SummaryDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  text-align: center;
`;

const SummaryItem = styled.p`
  margin: 0;
  text-align: center;
`;

const ContainerRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const DiagnosisContainer = styled.div`
  flex: 1;
  margin-right: 10px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
`;

const ComplaintsContainer = styled.div`
  flex: 1;
  margin-right: 10px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
`;

const FindingsContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
`;

const PrescriptionContainer = styled.div`
  margin-top: 50px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 100%;
  height: 30%;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PlanContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;
const ProcedureContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;
const TestContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;
const SummaryContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 50%;
  height:auto;
  margin-left: auto;
  margin-right: auto;
`;

const PrescriptionDetails = () => {
  const location = useLocation();
  const { appointment } = location.state || {};
  const [diagnosisInputs, setDiagnosisInputs] = useState([{}]);
  const [complaintsInputs, setComplaintsInputs] = useState([{}]);
  const [findingsInputs, setFindingsInputs] = useState([{}]);
  const [prescriptionInputs, setPrescriptionInputs] = useState([
    { selectedPrescription: [], dosage: '', durationNumber: '', duration: '', m: false, a: false, e: false, n: false }
  ]);
  
  const [procedureRows, setProcedureRows] = useState([
    { id: 1, value: '' }
  ]);

  const [planDetails, setPlanDetails] = useState({
    plan1: '',
    plan2: '',
    plan3: ''
  });
  
  const [selectedTests, setSelectedTests] = useState([]);
  // const [medicineOptions, setMedicineOptions] = useState([]); // State to hold medicine_name options
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [gst, setGst] = useState('');
  const [total, setTotal] = useState('');

      
    const handleGenerateClick = () => {
      // Handle generation logic here, if needed
      console.log('Generate button clicked');
    };

  useEffect(() => {
    // Fetch medicine_name options from API
    axios.get('http://127.0.0.1:8000/pharmacy/data/')
      .then(response => {
        const medicineNames = response.data.map(medicine => ({
          label: medicine.medicine_name
        }));
        setMedicineOptions(medicineNames);
      })
      .catch(error => {
        console.error('Error fetching medicine names:', error);
      });
  }, []); // Empty dependency array ensures this effect runs once on component mount
  
  const handleAddRow = () => {
    const newRow = { id: procedureRows.length + 1, value: '' };
    setProcedureRows([...procedureRows, newRow]);
  };

  const handleInputChange = (id, newValue) => {
    const updatedRows = procedureRows.map(row =>
      row.id === id ? { ...row, value: newValue } : row
    );
    setProcedureRows(updatedRows);
  };

  const handlePlanChange = (event) => {
    const { id, value } = event.target;
    setPlanDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTestsChange = (selected) => {
    setSelectedTests(selected);
  };

  const handleAddInput = (setInputs) => {
    setInputs((prev) => [...prev, {}]);
  };

  const handleDeleteInput = (index, setInputs, inputs) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

 
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [billInputs, setBillInputs] = useState([
    { qty: '', price: '', gst: '', total: '' }
  ]);

  const handlePrescriptionChange = (index, key, value) => {
    const newInputs = [...prescriptionInputs];
    newInputs[index][key] = value;
    setPrescriptionInputs(newInputs);

    // Ensure billInputs array has the same length as prescriptionInputs
    if (billInputs.length < prescriptionInputs.length) {
      setBillInputs([...billInputs, { qty: '', price: '', gst: '', total: '' }]);
    }
  };

  const handleQtyOrPriceChange = (index, key, value) => {
    const newBillInputs = [...billInputs];
    newBillInputs[index] = { ...newBillInputs[index], [key]: value };

    // Calculate the total based on qty and price
    const qty = parseFloat(newBillInputs[index].qty) || 0;
    const price = parseFloat(newBillInputs[index].price) || 0;
    newBillInputs[index].total = (qty * price).toFixed(2); // Fix to 2 decimal places

    setBillInputs(newBillInputs);
  };
  
  const handleSubmit = async () => {
    const summaryData = {
        patient_name: appointment.patientName,  // Include patient name here
        diagnosis: diagnosisInputs.map(input => input.selectedDiagnosis?.map(d => d.label).join(', ') || 'None').join('\n'),
        complaints: complaintsInputs.map(input => input.selectedComplaints?.map(c => c.label).join(', ') || 'None').join('\n'),
        findings: findingsInputs.map(input => input.selectedFindings?.map(f => f.label).join(', ') || 'None').join('\n'),
        prescription: prescriptionInputs.map(input => {
            const times = ['M', 'A', 'E', 'N'].map(time => input[time.toLowerCase()] ? time : '').filter(Boolean).join(' ');
            return `${input.selectedPrescription?.map(p => p.label).join(', ') || 'None'} - Dosage: ${input.dosage || 'N/A'} - ${times} - Duration: ${input.durationNumber || 'N/A'} ${input.duration || ''}`;
        }).join('\n'),
        plans: `Plan1: ${planDetails.plan1 || 'None'}\nPlan2: ${planDetails.plan2 || 'None'}\nPlan3: ${planDetails.plan3 || 'None'}`,
        tests: selectedTests.map(test => test.label).join(', ') || 'None',
        procedures: procedureRows.map(row => row.value).join('\n') || 'None',
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/summary/post/', summaryData);
        console.log('Data saved successfully', response.data);
    } catch (error) {
        console.error('Error saving data', error);
    }
};

  
  const getSummaryDetails = () => {
    const diagnosis = diagnosisInputs.map((input, index) =>
      `${index + 1}. ${input.selectedDiagnosis?.map(d => d.label).join(', ') || 'None'}`
    ).join('\n') || 'None';
  
    const complaints = complaintsInputs.map((input, index) =>
      `${index + 1}. ${input.selectedComplaints?.map(c => c.label).join(', ') || 'None'}`
    ).join('\n') || 'None';
  
    const findings = findingsInputs.map((input, index) =>
      `${index + 1}. ${input.selectedFindings?.map(f => f.label).join(', ') || 'None'}`
    ).join('\n') || 'None';
  
    const prescriptionSummary = prescriptionInputs.map((input, index) => {
      const times = ['M', 'A', 'E', 'N'].map(time => input[time.toLowerCase()] ? time : '').filter(Boolean).join(' ');
      return `${index + 1}. ${input.selectedPrescription?.map(p => p.label).join(', ') || 'None'} - Dosage: ${input.dosage || 'N/A'} - ${times} - Duration: ${input.durationNumber || 'N/A'} ${input.duration || ''}`;
    }).join('\n') || 'None';
  
    const plans = [
      `Plan1: ${planDetails.plan1 || 'None'}`,
      `Plan2: ${planDetails.plan2 || 'None'}`,
      `Plan3: ${planDetails.plan3 || 'None'}`
    ].join('\n');
    const procedures = procedureRows.map((row, index) => `${index + 1}. ${row.value}`).join('\n') || 'None';
    const tests = `Tests: ${selectedTests.map(test => test.label).join(', ') || 'None'}`;
  
    return (
      <SummaryDetailsContainer>
        <SummaryItem><strong>Diagnosis:</strong><br /> {diagnosis}</SummaryItem>
        <SummaryItem><strong>Complaints:</strong><br /> {complaints}</SummaryItem>
        <SummaryItem><strong>Findings:</strong><br /> {findings}</SummaryItem>
        <SummaryItem><strong>Prescription:</strong><br /> {prescriptionSummary}</SummaryItem>
        <SummaryItem><strong>Plans:</strong><br /> {plans}</SummaryItem>
        <SummaryItem><strong>Tests:</strong><br /> {tests}</SummaryItem>
        <SummaryItem>Procedures:</SummaryItem>
        <SummaryItem>{procedures}</SummaryItem>
      </SummaryDetailsContainer>
    );
  };
  
  
  if (!appointment) {
    return <div>No appointment data available.</div>;
  }

  const transformList = list => list.map(item => ({ label: item }));

  return (
    <div>
      {/* <PatientDetailsContainer>
        <ProfileImage src={appointment.gender === 'Male' ? male : female} alt="Profile" />
        <PatientName className='mt-1'>Name: {appointment.patientName}</PatientName>
        <PatientText className='mt-1'>Phone: {appointment.mobileNumber}</PatientText>
        <PatientText className='mt-1'>Height:</PatientText>
        <PatientText className='mt-1'>Weight:</PatientText>
        <PatientText className='mt-1'>Pulse of Rate:</PatientText>
        <PatientText className='mt-1'>BP:</PatientText>
        <PatientText className='mt-1'>Purpose Of Visit: {appointment.purposeOfVisit}</PatientText>
      </PatientDetailsContainer> */}
      <br />

      <Tab.Container defaultActiveKey="consulting-room">
        <Nav variant="pills" style={{ justifyContent: 'center' }}>
          <Nav.Item>
            <Nav.Link eventKey="consulting-room">Consulting Room</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="instructions">Instructions</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="summary">Summary</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Bill">Bill</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="consulting-room">
            <br />
            <Col>
            <center>
              <DiagnosisContainer>
                {diagnosisInputs.map((input, index) => (
                 
                  <Row className="justify-content-center mb-3" key={index}>
                    <CenteredFormGroup as={Col} md="4" controlId={`diagnosis-${index}`}>
                      <Form.Label>Diagnosis</Form.Label>
                      <FlexContainer>
                        <BsPatchPlusFill size={24} onClick={() => handleAddInput(setDiagnosisInputs)} />
                        <Typeahead className='ms-2'
                          id={`diagnosis-typeahead-${index}`}
                          labelKey="label"
                          onChange={selected => {
                            const newInputs = [...diagnosisInputs];
                            newInputs[index] = { selectedDiagnosis: selected };
                            setDiagnosisInputs(newInputs);
                          }}
                          options={transformList(diagnosisList)}
                          placeholder="Select Diagnosis"
                          selected={Array.isArray(input.selectedDiagnosis) ? input.selectedDiagnosis : []}
                        />
                        <MdDelete size={24} onClick={() => handleDeleteInput(index, setDiagnosisInputs, diagnosisInputs)} />
                      </FlexContainer>
                    </CenteredFormGroup>
                  </Row>
                ))}
              </DiagnosisContainer>
            </center>
            <br />
            <center>
              <ComplaintsContainer>
                {complaintsInputs.map((input, index) => (
                  <Row className="justify-content-center mb-3" key={index}>
                    <CenteredFormGroup as={Col} md="4" controlId={`complaints-${index}`}>
                      <Form.Label>Complaints</Form.Label>
                      <FlexContainer>
                        <BsPatchPlusFill size={24} onClick={() => handleAddInput(setComplaintsInputs)} />
                        <Typeahead className='ms-2'
                          id={`complaints-typeahead-${index}`}
                          labelKey="label"
                          onChange={selected => {
                            const newInputs = [...complaintsInputs];
                            newInputs[index] = { selectedComplaints: selected };
                            setComplaintsInputs(newInputs);
                          }}
                          options={transformList(patientComplaints)}
                          placeholder="Select Complaints"
                          selected={Array.isArray(input.selectedComplaints) ? input.selectedComplaints : []}
                        />
                        <MdDelete size={24} onClick={() => handleDeleteInput(index, setComplaintsInputs, complaintsInputs)} />
                      </FlexContainer>
                    </CenteredFormGroup>
                  </Row>
                  
                ))}
              </ComplaintsContainer>
              
            </center>
            </Col>
            
            <br />
            <center>
              <FindingsContainer>
                {findingsInputs.map((input, index) => (
                  <Row className="justify-content-center mb-3" key={index}>
                    <CenteredFormGroup as={Col} md="4" controlId={`findings-${index}`}>
                      <Form.Label>Findings</Form.Label>
                      <FlexContainer>
                        <BsPatchPlusFill size={24} onClick={() => handleAddInput(setFindingsInputs)} />
                        <Typeahead className='ms-2'
                          id={`findings-typeahead-${index}`}
                          labelKey="label"
                          onChange={selected => {
                            const newInputs = [...findingsInputs];
                            newInputs[index] = { selectedFindings: selected };
                            setFindingsInputs(newInputs);
                          }}
                          options={transformList(findingsList)}
                          placeholder="Select Findings"
                          selected={Array.isArray(input.selectedFindings) ? input.selectedFindings : []}
                        />
                        <MdDelete size={24} onClick={() => handleDeleteInput(index, setFindingsInputs, findingsInputs)} />
                      </FlexContainer>
                    </CenteredFormGroup>
                  </Row>
                ))}
              </FindingsContainer>
            </center>
            <br />
            <center>
            <PrescriptionContainer>
                <SectionTitle>Prescription</SectionTitle>
                {prescriptionInputs.map((input, index) => (
                <Form.Group as={Row} className="mb-3" controlId={`prescription-${index}`} key={index}>
                  <Col sm="3">
                    <Typeahead
                      labelKey="label"
                      multiple
                      options={medicineOptions} // Use medicineOptions fetched from backend
                      placeholder="Choose prescription..."
                      onChange={(selected) => handlePrescriptionChange(index, 'selectedPrescription', selected)}
                      selected={input.selectedPrescription || []}
                      />
                    </Col>
                    <Col sm="1">
                      <Form.Control
                        type="text"
                        placeholder="Dosage"
                        value={input.dosage || ''}
                        onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                      />
                    </Col>
                    {prescriptionInputs.map((input, index) => (
                      <Col sm="4" key={index}>
                        <Form.Check
                          inline
                          label="M"
                          type="checkbox"
                          checked={input.m}
                          onChange={(e) => handlePrescriptionChange(index, 'm', e.target.checked)}
                        />
                        <Form.Check
                          inline
                          label="A"
                          type="checkbox"
                          checked={input.a}
                          onChange={(e) => handlePrescriptionChange(index, 'a', e.target.checked)}
                        />
                        <Form.Check
                          inline
                          label="E"
                          type="checkbox"
                          checked={input.e}
                          onChange={(e) => handlePrescriptionChange(index, 'e', e.target.checked)}
                        />
                        <Form.Check
                          inline
                          label="N"
                          type="checkbox"
                          checked={input.n}
                          onChange={(e) => handlePrescriptionChange(index, 'n', e.target.checked)}
                        />
                      </Col>
                    ))}

                    <Col sm="1">
                      <Form.Control
                        type="text"
                        placeholder="Number"
                        value={input.durationNumber || ''}
                        onChange={(e) => handlePrescriptionChange(index, 'durationNumber', e.target.value)}
                      />
                    </Col>
                    <Col sm="1">
                      <Form.Control
                        as="select"
                        value={input.duration || ''}
                        onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                      >
                        <option value="">Duration</option>
                        <option value="Days">Days</option>
                        <option value="Weeks">Weeks</option>
                        <option value="Months">Months</option>
                        <option value="Years">Years</option>
                        <option value="To Be Continued">To Be Continued</option>
                      </Form.Control>
                    </Col>
                    <Col sm="2" className="d-flex align-items-center">
                      <BsPatchPlusFill onClick={() => handleAddInput(setPrescriptionInputs)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                      <MdDelete onClick={() => handleDeleteInput(index, setPrescriptionInputs, prescriptionInputs)} style={{ cursor: 'pointer' }} />
                    </Col>
                  </Form.Group>
                ))}
              </PrescriptionContainer>
            </center>
            <br />
          </Tab.Pane>

          <Tab.Pane eventKey="instructions">
            <br />
            <PlanContainer>
              <Row className="justify-content-center">
                <Col md="3" className="text-center">
                  <Form.Group controlId="plan1">
                    <Form.Label>Plan1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Plan1 details"
                      value={planDetails.plan1}
                      onChange={handlePlanChange}
                    />
                  </Form.Group>
                </Col>
                <Col md="3" className="text-center">
                  <Form.Group controlId="plan2">
                    <Form.Label>Plan2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Plan2 details"
                      value={planDetails.plan2}
                      onChange={handlePlanChange}
                    />
                  </Form.Group>
                </Col>
                <Col md="3" className="text-center">
                  <Form.Group controlId="plan3">
                    <Form.Label>Plan3</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Plan3 details"
                      value={planDetails.plan3}
                      onChange={handlePlanChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </PlanContainer>
            <SectionTitle>Tests</SectionTitle>
            <center>
              <TestContainer>
                <Form>
                  <Form.Group controlId="tests">
                    <Form.Label>Tests</Form.Label>
                    <Typeahead
                      id="test-combobox"
                      labelKey="label"
                      multiple
                      options={test.map(item => ({ label: item }))}
                      placeholder="Select Tests"
                      onChange={handleTestsChange}
                      selected={selectedTests}
                    />
                  </Form.Group>
                </Form>
              </TestContainer>
            </center>
            <SectionTitle>Procedure</SectionTitle>
            <ProcedureContainer>
              {procedureRows.map(row => (
                <Row key={row.id} className="mb-3">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder={`Procedure ${row.id}`}
                      value={row.value}
                      onChange={e => handleInputChange(row.id, e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
              <button onClick={handleAddRow}>Add Procedure</button>
            </ProcedureContainer>
          </Tab.Pane>

          <Tab.Pane eventKey="summary">
            <br />
            <SummaryContainer>
              <center>
              {getSummaryDetails()}
              <button onClick={handleSubmit} >
                  Save 
           </button>
                </center>
            </SummaryContainer>
          
          </Tab.Pane>

          <Tab.Pane eventKey="Bill">
            <br />
            <center>
            <div>
                <br />
                <div className="table-responsive">
                <table className="table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th >Qty </th>
                <th>Price</th>
                <th>GST(%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            {prescriptionInputs.map((input, index) => (
              input.selectedPrescription.map((prescription, i) => (
                <tr key={`${index}-${i}`}>
                  <td>{prescription.label}</td>
                  <td>
                    <input
        
                      className="form-control form-control-sm"
                      value={billInputs[index]?.qty || ''}
                      onChange={(e) => handleQtyOrPriceChange(index, 'qty', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={billInputs[index]?.price || ''}
                      onChange={(e) => handleQtyOrPriceChange(index, 'price', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={billInputs[index]?.gst || ''}
                      onChange={(e) => handleQtyOrPriceChange(index, 'gst', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={billInputs[index]?.total || ''}
                      readOnly // Make the total textbox non-editable
                    />
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
              </div>
              <br />
              <center>
                <button onClick={handleGenerateClick}>
                  Generate
                </button>
              </center>
            </div>
          <br />
          </center>
        </Tab.Pane>

        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default PrescriptionDetails;

