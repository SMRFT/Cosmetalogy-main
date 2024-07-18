import React, { useState,useEffect } from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const SectionTitle = styled.h4`
  margin-top: 20px;
  text-align: center;
`;

// const PatientDetailsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background-color: #f7f7f7;
//   padding: 20px;
//   height: auto;
//   margin: 0;
//   position: absolute;
// `;

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

const DiagnosisContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 30%;
  height: 30%;
`;

const ComplaintsContainer = styled.div`
  margin-top: 50px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 30%;
  height: 30%;
`;

const FindingsContainer = styled.div`
  margin-top: 50px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 30%;
  height: 30%;
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
// const ProcedureContainer = styled.div`
//   margin-top: 20px;
//   padding: 20px;
//   background-color: #f1f1f1;
//   border-radius: 10px;
//   width: 70%;
//   margin-left: auto;
//   margin-right: auto;
// `;

const NextVisitonContainer = styled.div`
  margin-bottom: -2%;
  height:auto
  background-color: #f1f1f1;
  border-radius: 10px;
  width:auto;
  margin-left: auto;
  margin-right: auto;
`;
const DateDisplay = styled.div`
  font-size: 16px;
  color: #333;
`;

const CalendarIcon = styled(FaCalendarAlt)`
  font-size: 24px;
  cursor: pointer;
  color: #007bff;
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

const ImageContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  height:auto;
  width:auto;
  background-color: #f1f1f1;
  justify-content: flex-start;
`;

const UploadedImage = styled.img`
  width: 100px;
  height: 100px;
  margin: 5px;
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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
   const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
      // Function to handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploaded = files.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
    }));
    setUploadedImages([...uploadedImages, ...uploaded]);
  };

    
    const [medicineOptions, setMedicineOptions] = useState([]);

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
    }, []);
  
    const handlePrescriptionChange = (index, key, value) => {
      const newInputs = [...prescriptionInputs];
      newInputs[index][key] = value;
      setPrescriptionInputs(newInputs);
    };
  
    const handleCheckboxChange = (index, checkboxKey) => {
      const newInputs = [...prescriptionInputs];
      newInputs[index][checkboxKey] = !newInputs[index][checkboxKey];
      setPrescriptionInputs(newInputs);
    };
  
    const handlePrescriptionAddInput = () => {
      setPrescriptionInputs([
        ...prescriptionInputs,
        { selectedPrescription: [], dosage: '', durationNumber: '', duration: '', m: false, a: false, e: false, n: false }
      ]);
    };
  
    const handlePrescriptionDeleteInput = (index) => {
      const newInputs = [...prescriptionInputs];
      newInputs.splice(index, 1);
      setPrescriptionInputs(newInputs);
    };
  
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

 
  
  const handleSubmit = async () => {
    const summaryData = {
        patient_name: appointment.patientName,
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
        uploadedImages: uploadedImages.map(img => ({ src: img.src, alt: img.alt })),
        nextVisit: selectedDate ? selectedDate.toISOString() : null, // Convert to ISO format if needed by backend
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
  const nextVisitDate = selectedDate ? selectedDate.toLocaleDateString() : 'None';

  // Render images as <img> elements
  const Images = uploadedImages.map((img, index) => (
      <img key={index} src={img.src} alt={img.alt} style={{ maxWidth: '100%', height: 'auto', margin: '10px' }} />
  ));

  return (
      <SummaryDetailsContainer>
          <SummaryItem><strong>Diagnosis:</strong><br /> {diagnosis}</SummaryItem>
          <SummaryItem><strong>Complaints:</strong><br /> {complaints}</SummaryItem>
          <SummaryItem><strong>Findings:</strong><br /> {findings}</SummaryItem>
          <SummaryItem><strong>Prescription:</strong><br /> {prescriptionSummary}</SummaryItem>
          <SummaryItem><strong>Plans:</strong><br /> {plans}</SummaryItem>
          <SummaryItem><strong>Tests:</strong><br /> {tests}</SummaryItem>
          <SummaryItem>Procedures:<br /> {procedures}</SummaryItem>
          <SummaryItem><strong>Images:</strong><br /> {Images.length > 0 ? Images : 'None'}</SummaryItem>
          <SummaryItem><strong>Next Visit Date:</strong><br /> {nextVisitDate}</SummaryItem>
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
              <br />
            <ImageContainer>
              <SectionTitle>Images</SectionTitle>
              <br/>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label> </Form.Label>
              <div>
                <input type="file" multiple onChange={handleImageUpload} />
               
              </div>
            </Form.Group>
            {uploadedImages.map((image, index) => (
              <Row key={index}>
                <Col>
                  <UploadedImage src={image.src} alt={image.alt} />
                </Col>
              </Row>
            ))}
          </ImageContainer>
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
              options={medicineOptions}
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
          <Col sm="4">
            <Form.Check
              inline
              label="M"
              type="checkbox"
              checked={input.m}
              onChange={() => handleCheckboxChange(index, 'm')}
            />
            <Form.Check
              inline
              label="A"
              type="checkbox"
              checked={input.a}
              onChange={() => handleCheckboxChange(index, 'a')}
            />
            <Form.Check
              inline
              label="E"
              type="checkbox"
              checked={input.e}
              onChange={() => handleCheckboxChange(index, 'e')}
            />
            <Form.Check
              inline
              label="N"
              type="checkbox"
              checked={input.n}
              onChange={() => handleCheckboxChange(index, 'n')}
            />
          </Col>
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
          <Col sm="2">
            <BsPatchPlusFill onClick={handlePrescriptionAddInput} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            <MdDelete onClick={() => handlePrescriptionDeleteInput(index)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
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
            {/* <ProcedureContainer>
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
            </ProcedureContainer> */}
        <center>
      <NextVisitonContainer>
        <SectionTitle>Next Visit</SectionTitle>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          customInput={<CalendarIcon />}
          popperPlacement="bottom-end"
          dateFormat="dd/MM/yyyy"
        />
      
        <DateDisplay>
          <br/>
          {selectedDate ? `Next Visit on: ${formatDate(selectedDate)}` : 'Next Visit on: Select a date'}
        </DateDisplay>
      </NextVisitonContainer>
    </center>
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
         

        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default PrescriptionDetails;