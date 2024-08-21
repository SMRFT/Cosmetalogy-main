import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfWeek, startOfMonth, addWeeks, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarWeek, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaDownload, FaTrash } from "react-icons/fa";

// Utility function to format text
const formatText = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const BillingProcedureReport = () => {
    const [billingData, setBillingData] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [message, setMessage] = useState('');
  
    const getReportHeading = (interval) => {
      switch (interval) {
        case 'day':
          return 'Daily Report';
        case 'week':
          return 'Weekly Report';
        case 'month':
          return 'Monthly Report';
        default:
          return 'Billing Report';
      }
    };
  
    useEffect(() => {
      if (selectedInterval === 'week' && !selectedWeek) {
        setSelectedWeek(startOfWeek(selectedDate, { weekStartsOn: 1 }));
      }
      fetchData(selectedInterval);
    }, [selectedInterval, selectedDate, selectedWeek]);
  
    const fetchData = async (interval) => {
      let dateParam = '';
      if (interval === 'day') {
        dateParam = format(selectedDate, 'yyyy-MM-dd');
      } else if (interval === 'week' && selectedWeek) {
        dateParam = format(selectedWeek, 'yyyy-MM-dd');
      } else if (interval === 'month') {
        const startOfMonthDate = startOfMonth(selectedDate);
        dateParam = format(startOfMonthDate, 'yyyy-MM-dd');
      }
  
      try {
        const response = await axios.get(`http://127.0.0.1:8000/procedurebilling/${interval}/?appointmentDate=${dateParam}`);
        
        // Check if data is already an object
        if (typeof response.data === 'string') {
          setBillingData(JSON.parse(response.data));
        } else {
          setBillingData(response.data);
        }
        
        setMessage('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error fetching data.');
      }
    };
  
    const handleIntervalChange = (interval) => {
      setSelectedInterval(interval);
      setSelectedWeek(null);
    };
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handleWeekChange = (weekStart) => {
      setSelectedWeek(weekStart);
    };
  
    const getWeeksInMonth = (date) => {
      const startOfMonthDate = startOfMonth(date);
      const weeks = [];
      for (let i = 0; i < 5; i++) {
        const weekStart = addWeeks(startOfMonthDate, i);
        if (weekStart.getMonth() === date.getMonth()) {
          weeks.push(weekStart);
        }
      }
      return weeks;
    };
  
    const downloadCSV = () => {
      if (!billingData) return;
  
      const headers = ['Patient Name', 'Particulars', 'Quantity', 'Price', 'GST', 'Total'];
      const rows = billingData.flatMap(item => 
        item.table_data.map((data, index) => [
          index === 0 ? item.patientName : '', // Only display the patient name once
          data.particulars, 
          data.qty, 
          data.price, 
          data.gst, 
          data.total
        ])
      );
  
      const csvContent = [
        headers.join(','), 
        ...rows.map(row => row.join(','))
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${getReportHeading(selectedInterval)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <Container>
        <Header>
          <h3 className='text-center mb-2'>Procedure Billing Report</h3>
        </Header>
        <IntervalSelector>
          <ButtonGroup>
            <IntervalButton
              title='Daily Report'
              onClick={() => handleIntervalChange('day')}
              className={selectedInterval === 'day' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faCalendarDay} />
            </IntervalButton>
            <IntervalButton
              title='Weekly Report'
              onClick={() => handleIntervalChange('week')}
              className={selectedInterval === 'week' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faCalendarWeek} />
            </IntervalButton>
            <IntervalButton
              title='Monthly Report'
              onClick={() => handleIntervalChange('month')}
              className={selectedInterval === 'month' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
            </IntervalButton>
          </ButtonGroup>
          <DatePickerWrapper>
            {selectedInterval === 'day' && (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                showPopperArrow={false}
                customInput={<CustomDateInput />}
              />
            )}
            {selectedInterval === 'week' && (
              <>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  showPopperArrow={false}
                  customInput={<CustomDateInput />}
                />
              </>
            )}
            {selectedInterval === 'month' && (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                showPopperArrow={false}
                customInput={<CustomDateInput />}
              />
            )}
          </DatePickerWrapper>
        </IntervalSelector>
        {selectedInterval === 'week' && (
          <WeekButtons>
            {getWeeksInMonth(selectedDate).map((weekStart, index) => (
              <WeekButton
                key={index}
                onClick={() => handleWeekChange(weekStart)}
                className={selectedWeek && format(selectedWeek, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd') ? 'active' : ''}
              >
                {`${index + 1} Week`}
              </WeekButton>
            ))}
          </WeekButtons>
        )}
        <br/>
        <Content>
          {message && <Message>{message}</Message>}
          {billingData && billingData.length > 0 ? (
            <Summary>
              <h5 className='text-center'>{getReportHeading(selectedInterval)}</h5>
              <table align='middle'>
                <MDBTableHead align='middle'>
                  <tr>
                    <th>Patient Name</th>
                    <th>Patient UID</th>
                    <th>Appointment Date</th>
                    <th>Procedure</th>
                    <th>Procedure Date</th>
                    <th>Price</th>
                    <th>GST</th>
                    <th>GST Rate</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {billingData.map((item) => {
                    // Only parse if the data is a string
                    const procedures = typeof item.procedures === 'string' ? JSON.parse(item.procedures) : item.procedures;
                    const consumer = typeof item.consumer === 'string' ? JSON.parse(item.consumer) : item.consumer;
                    return (
                      <tr key={item._id?.$oid ?? item._id}>
                        <td>{item.patientName}</td>
                        <td>{item.patientUID}</td>
                        <td>{item.appointmentDate}</td>
                        <td>{procedures.map((proc, index) => (
                          <div key={index}>{proc.procedure}</div>
                        ))}</td>
                        <td>{procedures.map((proc, index) => (
                          <div key={index}>{proc.procedureDate}</div>
                        ))}</td>
                        <td>{procedures.map((proc, index) => (
                          <div key={index}>{proc.price}</div>
                        ))}</td>
                        <td>{procedures.map((proc, index) => (
                          <div key={index}>{proc.gst}</div>
                        ))}</td>
                        <td>{procedures.map((proc, index) => (
                          <div key={index}>{proc.gstRate}</div>
                        ))}</td>
                        <td>{consumer.map((con, index) => (
                          <div key={index}>{con.item}</div>
                        ))}</td>
                        <td>{consumer.map((con, index) => (
                          <div key={index}>{con.qty}</div>
                        ))}</td>
                        <td>{consumer.map((con, index) => (
                          <div key={index}>{con.total}</div>
                        ))}</td>
                      </tr>
                    );
                  })}
                </MDBTableBody>
              </table>
            </Summary>
          ) : (
            <Message>No data available for the selected interval.</Message>
          )}
        </Content>
      </Container>
    );
  };

export default BillingProcedureReport;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 65px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const IntervalSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: -30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2px;
  font-weight: bold;
`;

const IntervalButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: white;
  color: #C85C8E;
  font-size: 1.5rem;
  cursor: pointer;
`;

const DatePickerWrapper = styled.div`
  color: #C85C8E;
`;

const WeekButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const WeekButton = styled.button`
  border: none;
  background-color: white;
  color: #C85C8E;
  cursor: pointer;
`;

const Summary = styled.div`
  flex: 1;
  overflow-x: auto;
`;

const StyledRow = styled.tr`
  &:nth-child(even) {
    background-color: #ffffff;
  }
`;

const Message = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const CustomDateInput = styled.input`
  border: none;
  padding: 8px;
  color: #C85C8E;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  background-color: white;
  font-weight: bold;
  text-align: center;
`;

