import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfWeek, startOfMonth, addWeeks, format } from 'date-fns';

const Report = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);

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
      const response = await axios.get(`http://127.0.0.1:8000/summary/${interval}?date=${dateParam}`);
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <Container>
      <Header>
        <h3 className='text-center mb-2'>Billing Report</h3>
      </Header>
      <IntervalSelector>
        <ButtonGroup>
          <IntervalButton
            onClick={() => handleIntervalChange('day')}
            className={selectedInterval === 'day' ? 'active' : ''}
          >
            Day
          </IntervalButton>
          <IntervalButton
            onClick={() => handleIntervalChange('week')}
            className={selectedInterval === 'week' ? 'active' : ''}
          >
            Week
          </IntervalButton>
          <IntervalButton
            onClick={() => handleIntervalChange('month')}
            className={selectedInterval === 'month' ? 'active' : ''}
          >
            Month
          </IntervalButton>
        </ButtonGroup>
        <DatePickerWrapper>
          {selectedInterval === 'day' && (
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              showPopperArrow={false}
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
      <Content>
        {summaryData ? (
          <Summary>
            <h4 className='text-center'>{selectedInterval} Wise Billing Report</h4>
            <StyledTable align='middle'>
              <MDBTableHead align='middle'>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Diagnosis</th>
                  <th>Complaints</th>
                  <th>Findings</th>
                  <th>Prescription</th>
                  <th>Plans</th>
                  <th>Tests</th>
                  <th>Procedure</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {summaryData.map((item) => (
                  <StyledRow key={item.id}>
                    <td>{item.patient_name}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.diagnosis}</td>
                    <td>{item.complaints}</td>
                    <td>{item.findings}</td>
                    <td>{item.prescription}</td>
                    <td>{item.plans}</td>
                    <td>{item.tests}</td>
                    <td>{item.procedures}</td>
                  </StyledRow>
                ))}
              </MDBTableBody>
            </StyledTable>
          </Summary>
        ) : (
          <Message>Loading...</Message>
        )}
      </Content>
    </Container>
  );
};

export default Report;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
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
  margin-bottom: 20px;

  .active {
    background-color: #007bff;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const IntervalButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #f8f9fa;
  color: #007bff;
  cursor: pointer;
  &:hover {
    background-color: #e9ecef;
  }
`;

const DatePickerWrapper = styled.div`
  margin-left: 10px;
`;

const WeekButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const WeekButton = styled.button`
  border: none;
  background-color: #f8f9fa;
  color: #007bff;
  cursor: pointer;
  &:hover {
    background-color: #e9ecef;
  }

  &.active {
    background-color: #007bff;
    color: white;
  }
`;

const Summary = styled.div`
  flex: 1;
  overflow-x: auto;
`;

const StyledTable = styled(MDBTable)`
  width: 100%;
  border-collapse: collapse;
  font-family: cursive;

  th {
    background-color: rgb(125,163,158);
    color: white;
    white-space: nowrap;
    padding: 10px;
    border: 1px solid #dee2e6;
    text-align: center;
    font-weight: bold;
  }

  td {
    padding: 10px;
    border: 1px solid #dee2e6;
    text-align: center;
    color: black;
  }

  th,
  td {
    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-right: none;
    }
  }
`;

const StyledRow = styled.tr`
  &:hover {
    background-color: #e9ecef;
  }
`;

const Message = styled.p`
  color: #6c757d;
  text-align: center;
  margin-top: 20px;
`;

