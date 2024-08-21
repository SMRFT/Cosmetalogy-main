import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { FaArrowLeft, FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DatePickerWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  .react-datepicker-wrapper {
    width: 0;
    overflow: hidden;
  }

  .calendar-icon {
    margin-right: 10px;
    color: #C85C8E;
    cursor: pointer;
  }

  .date-display {
    font-size: 16px;
    color: #C85C8E;
    cursor: pointer;
  }
`;

const PatientProcedureContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  gap: 20px;
`

const PatientCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: #d7cae2;
  color: #725F83;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
        height:auto;
        width:fit-content;
  &:hover {
    transform: scale(1.05);
  }

  .card-title {
    margin-bottom: 10px;
    font-size: 1.2em;
    font-weight: bold;
  }

  .card-subtitle {
    margin-bottom: 15px;
  }

  .btn {
    background-color: #007bff;
    color: white;
  }
`;
const PatientContainer = styled.div`
  margin-bottom: 20px;

`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px; /* Add margin if needed */
 font-weight:bold
`;
const ProcedureNetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;


const ProcedureNetLabel = styled.label`
  margin-right: 10px;
  font-size: 16px;
`;

const ProcedureNetInput = styled.input`
  padding: 5px;
  font-size: 16px;
  margin-right: 10px;
`;
const ConsumerNetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;


const ConsumerNetLabel = styled.label`
  margin-right: 10px;
  font-size: 16px;
`;

const ConsumerNetInput = styled.input`
  padding: 5px;
  font-size: 16px;
  margin-right: 10px;
`;

const Container = styled.div`
  margin-top: 65px;
`;

const ProcedureComponent = () => {
  const [patients, setPatients] = useState([]);
  const [detailedRecords, setDetailedRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consumerRecords, setConsumerRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [viewDetails, setViewDetails] = useState(false);
  const [procedureNetAmount, setProcedureNetAmount] = useState('0');
  const [consumerNetAmount, setConsumerNetAmount] = useState('0');
  const [totalAmount, setTotalAmount] = useState('0');

  const datePickerRef = useRef(null);

  // Fetch procedures based on date
  const fetchProcedures = async (date) => {
      try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const response = await axios.get(`http://127.0.0.1:8000/get_procedures_bill/?appointmentDate=${formattedDate}`);
          if (Array.isArray(response.data.detailedRecords)) {
              setPatients(response.data.detailedRecords);
              if (!selectedPatient) {
                  setDetailedRecords([]);
              }
          } else {
              console.error("Expected an array for detailedRecords, but received:", response.data.detailedRecords);
              setPatients([]);
              setDetailedRecords([]);
          }
      } catch (error) {
          console.error("Error fetching procedure list", error);
          setPatients([]);
          setDetailedRecords([]);
      }
  };

  useEffect(() => {
      const initialDate = new Date();
      setSelectedDate(initialDate);
      fetchProcedures(initialDate);
  }, []);

  useEffect(() => {
      if (selectedPatient) {
          const selectedPatientProcedures = patients.filter(
              record => record.patientUID === selectedPatient.patientUID
          );
          setDetailedRecords(selectedPatientProcedures);
          const initialConsumerRecords = selectedPatientProcedures.map(() => ({
              item: '',
              qty: '',
              price: '',
              total: ''
          }));
          setConsumerRecords(initialConsumerRecords);
      } else {
          setDetailedRecords([]);
          setConsumerRecords([]);
      }
  }, [selectedPatient, patients]);

  const handleDateChange = (date) => {
      setSelectedDate(date);
      fetchProcedures(date);
  };

  const handleViewClick = (patient) => {
      setSelectedPatient(patient);
      setViewDetails(true);
  };

  const handleBackClick = () => {
      setSelectedPatient(null);
      setViewDetails(false);
  };

  const handlePriceChange = (index, newPrice) => {
      const updatedRecords = [...detailedRecords];
      const price = parseFloat(newPrice);
      updatedRecords.forEach(record => {
          if (record.procedures[index]) {
              record.procedures[index].price = isNaN(price) ? '' : price;
              record.procedures[index].gst = calculateGST(price, record.procedures[index].gstRate);
          }
      });
      setDetailedRecords(updatedRecords);
  };

  const handleGstRateChange = (index, newGstRate) => {
      const updatedRecords = [...detailedRecords];
      const gstRate = parseFloat(newGstRate);
      updatedRecords.forEach(record => {
          if (record.procedures[index]) {
              record.procedures[index].gstRate = isNaN(gstRate) ? 0 : gstRate;
              record.procedures[index].gst = calculateGST(record.procedures[index].price, gstRate);
          }
      });
      setDetailedRecords(updatedRecords);
  };

  const calculateGST = (price, gstRate) => {
      return (price && gstRate ? ((price * gstRate) / 100).toFixed(2) : '0');
  };

  const calculateTotal = (price, gst) => {
      return (price && gst ? (parseFloat(price) + parseFloat(gst)).toFixed(2) : '0');
  };

  const handleConsumerChange = (index, field, value) => {
      const updatedRecords = [...consumerRecords];
      updatedRecords[index][field] = value;
      if (field === 'qty' || field === 'price') {
          const qty = parseFloat(updatedRecords[index].qty);
          const price = parseFloat(updatedRecords[index].price);
          updatedRecords[index].total = !isNaN(qty) && !isNaN(price) ? (qty * price).toFixed(2) : '0';
      }
      setConsumerRecords(updatedRecords);
  };

  const addConsumerRow = () => {
      setConsumerRecords([...consumerRecords, { item: '', qty: '', price: '', total: '' }]);
  };

  const calculateProcedureTotal = () => {
      const total = detailedRecords.reduce((acc, record) => {
          return acc + record.procedures.reduce((sum, procedure) => {
              const price = parseFloat(procedure.price) || 0;
              const gst = parseFloat(procedure.gst) || 0;
              return sum + price + gst;
          }, 0);
      }, 0);

      setProcedureNetAmount(total.toFixed(2));
  };

  useEffect(() => {
      calculateProcedureTotal();
  }, [detailedRecords]);

  useEffect(() => {
      const procedureAmount = parseFloat(procedureNetAmount) || 0;
      const consumerAmount = parseFloat(consumerNetAmount) || 0;
      setTotalAmount((procedureAmount + consumerAmount).toFixed(2));
  }, [procedureNetAmount, consumerNetAmount]);

  const calculateConsumerTotal = () => {
      const total = consumerRecords.reduce((acc, record) => {
          const itemTotal = parseFloat(record.total) || 0;
          return acc + itemTotal;
      }, 0);

      setConsumerNetAmount(total.toFixed(2));
  };

  useEffect(() => {
      calculateConsumerTotal();
  }, [consumerRecords]);

  const handleSave = async () => {
      if (selectedPatient) {
          const appointmentDate = detailedRecords[0]?.appointmentDate;
          const proceduresWithoutPatientInfo = detailedRecords.map(({ patientUID, patientName, appointmentDate, ...rest }) => rest);
          const payload = {
              patientName: selectedPatient.patientName,
              patientUID: selectedPatient.patientUID,
              procedures: proceduresWithoutPatientInfo,
              consumer: consumerRecords,
              appointmentDate: appointmentDate,
              procedureNetAmount: procedureNetAmount,
              consumerNetAmount: consumerNetAmount,
              totalAmount: totalAmount,
          };

          try {
              const response = await axios.post('http://127.0.0.1:8000/Post_Procedure_Bill/', payload);
              console.log('Data saved successfully:', response.data);
              setSuccessMessage(`Procedure bill generated successfully for ${selectedPatient.patientName}`);
              setTimeout(() => setSuccessMessage(''), 5000);
          } catch (error) {
              console.error('Error saving data:', error);
              setSuccessMessage('Error generating procedure bill');
          }
      } else {
          console.error('No patient selected');
          setSuccessMessage('No patient selected');
      }
  };

  const handleDownload = () => {
      const doc = new jsPDF();
  
      doc.setFontSize(18);
      doc.text('Procedure Bill', 14, 22);
  
      if (selectedPatient) {
          doc.setFontSize(12);
          doc.text(`Patient Name: ${selectedPatient.patientName}`, 14, 30);
          doc.text(`Patient UID: ${selectedPatient.patientUID}`, 14, 36);
      }
  
      let yOffset = 42; // Starting Y offset for the tables
  
      if (detailedRecords.length > 0) {
          const procedureTable = detailedRecords.flatMap(record => 
              record.procedures.map(procedure => [
                  procedure.procedure,
                  procedure.procedureDate,
                  procedure.price,
                  procedure.gstRate,
                  calculateGST(procedure.price, procedure.gstRate),
                  calculateTotal(procedure.price, calculateGST(procedure.price, procedure.gstRate))
              ])
          );
  
          doc.autoTable({
              head: [['Procedure', 'Procedure Date', 'Price', 'GST Rate (%)', 'GST', 'Total']],
              body: procedureTable,
              startY: yOffset,
              theme: 'striped',
              margin: { bottom: 10 }
          });
  
          yOffset = doc.previousAutoTable.finalY + 10; // Update Y offset for the next table
      }
  
      if (consumerRecords.length > 0) {
          const consumerTable = consumerRecords.map(record => [
              record.item,
              record.qty,
              record.price,
              record.total
          ]);
  
          doc.autoTable({
              head: [['Item', 'Qty', 'Price', 'Total']],
              body: consumerTable,
              startY: yOffset,
              theme: 'striped',
              margin: { bottom: 10 }
          });
  
          yOffset = doc.previousAutoTable.finalY + 10; // Update Y offset for the total amount
      }
  
      doc.setFontSize(12);
      doc.text(`Total Amount: ${totalAmount}`, 14, yOffset);
  
      doc.save('procedure_bill.pdf');
  };

      return (
        <Container className="container">
          {viewDetails ? (
            <div>
              <FlexRow>
                <button className="mt-4" onClick={handleBackClick}><FaArrowLeft/></button>
                {selectedPatient.patientName} ({selectedPatient.patientUID})
              </FlexRow>
              <center><h4>Procedure Bill</h4></center>
              {detailedRecords.length > 0 && (
                <>
               <table>
                                <thead>
                                    <tr>
                                        <th>Procedure</th>
                                        <th>Procedure Date</th>
                                        <th>Price</th>
                                        <th>GST Rate (%)</th>
                                        <th>GST</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedRecords.map((record, recordIndex) => {
                                        return record.procedures.map((procedure, index) => {
                                            const gst = calculateGST(procedure.price, procedure.gstRate);
                                            const total = calculateTotal(procedure.price, gst);

                                            return (
                                                <tr key={`${recordIndex}-${index}`}>
                                                    <td>{procedure.procedure}</td>
                                                    <td>{procedure.procedureDate}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={procedure.price}
                                                            onChange={(e) => handlePriceChange(index, e.target.value)}
                                                            className="form-control"
                                                            placeholder="Enter price"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={procedure.gstRate}
                                                            onChange={(e) => handleGstRateChange(index, e.target.value)}
                                                            className="form-control"
                                                            placeholder="Enter GST rate"
                                                        />
                                                    </td>
                                                    <td>{gst}</td>
                                                    <td>{total}</td>
                                                </tr>
                                            );
                                        });
                                    })}
                                </tbody>
                            </table>
                  <br />
                  <ProcedureNetContainer>
                    <ProcedureNetLabel htmlFor="Net">Net Amount:</ProcedureNetLabel>
                    <ProcedureNetInput
                      type="text"
                      id="Net"
                      value={procedureNetAmount}
                      onChange={(e) => setProcedureNetAmount(e.target.value)}
                    />
                  </ProcedureNetContainer>
                  <div className="mt-4">
                    <center><h4>Consumer Bill</h4></center>
                    <div className="d-flex justify-content-end">
                      <button onClick={addConsumerRow}>
                        <FaPlus/>
                      </button>
                    </div>
                    <br />
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerRecords.map((record, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                value={record.item}
                                onChange={(e) => handleConsumerChange(index, 'item', e.target.value)}
                                className="form-control"
                                placeholder="Enter item"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={record.qty}
                                onChange={(e) => handleConsumerChange(index, 'qty', e.target.value)}
                                className="form-control"
                                placeholder="Enter quantity"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={record.price}
                                onChange={(e) => handleConsumerChange(index, 'price', e.target.value)}
                                className="form-control"
                                placeholder="Enter price"
                              />
                            </td>
                            <td>{record.total}</td>
                            <td>
                              <FaTrash
                                onClick={() => {
                                  const updatedRecords = consumerRecords.filter((_, i) => i !== index);
                                  setConsumerRecords(updatedRecords);
                                }}
                              >
                              </FaTrash>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br />
                  </div>
                  <ConsumerNetContainer>
                    <ConsumerNetLabel htmlFor="Net">Net Amount:</ConsumerNetLabel>
                    <ConsumerNetInput
                      type="text"
                      id="Net"
                      value={consumerNetAmount}
                      onChange={(e) => setConsumerNetAmount(e.target.value)}
                    />
                       <FlexRow>
                                <ProcedureNetLabel htmlFor="Total">Total Amount:</ProcedureNetLabel>
                                <ProcedureNetInput
                                    type="text"
                                    id="Total"
                                    value={totalAmount}
                                    readOnly
                                />
                            </FlexRow>
                  </ConsumerNetContainer>
                  <div className="d-flex flex-column align-items-center">
                    <Row className="g-3">
                      <Col xs="auto">
                        <button onClick={handleSave}>
                          Save
                        </button>
                      </Col>
                      <Col xs="auto">
                        <button onClick={handleDownload}>
                          Download as pdf
                        </button>
                      </Col>
                    </Row>
                    {successMessage && (
                      <Alert className="mt-3" variant="success">
                        {successMessage}
                      </Alert>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <center>
                <h3 className="mt-4">Procedure Bill</h3>
                <br />
                <DatePickerWrapper>
                  <FaCalendarAlt
                    className="calendar-icon"
                    onClick={() => datePickerRef.current.setFocus()}
                  />
                  <div className="date-display" onClick={() => datePickerRef.current.setFocus()}>
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Select a date'}
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    ref={datePickerRef}
                  />
                </DatePickerWrapper>
              </center>
              <br />
              <br />
              <PatientProcedureContainer >
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <PatientContainer key={index} >
                      <PatientCard>
                        <div className="card-title">{patient.patientName}</div>
                        <div className="card-subtitle">{patient.patientUID}</div>
                        <button style={{fontSize:"0.9rem"}} onClick={() => handleViewClick(patient)}>
                          View Procedure
                        </button>
                      </PatientCard>
                      <br />
                    </PatientContainer>
                  ))
                ) : (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '300px' }}
                  >
                    <p>No procedures found for this date.</p>
                  </div>
                )}
              </PatientProcedureContainer>
            </div>
          )}
        </Container>
      );
    };
    export default ProcedureComponent;    
