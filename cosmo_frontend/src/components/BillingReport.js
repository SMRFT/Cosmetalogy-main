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

// Utility function to format texta
const formatText = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const BillingReport = () => {
  const [billingData, setBillingData] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [medicineOptions, setMedicineOptions] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/Doctor/SummaryReport');
  };

  const getReportHeading = (interval) => {
    switch (interval) {
      case 'date':
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
    if (interval === 'date') {
      dateParam = format(selectedDate, 'yyyy-MM-dd');
    } else if (interval === 'week' && selectedWeek) {
      dateParam = format(selectedWeek, 'yyyy-MM-dd');
    } else if (interval === 'month') {
      const startOfMonthDate = startOfMonth(selectedDate);
      dateParam = format(startOfMonthDate, 'yyyy-MM-dd');
    }
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/billing/${interval}/?appointmentDate=${dateParam}`);
      setBillingData(response.data.billing_data); // Adjust according to the backend response
      setMessage('');
      const initialEditableData = response.data.billing_data.reduce((acc, item) => {
          acc[item.patientUID] = item.table_data;
          return acc;
      }, {});
      setEditableData(initialEditableData);      
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

  const handleDelete = async (recordId) => {
    try {
        await axios.delete('http://127.0.0.1:8000/delete/billing/data/', {
            data: { record_id: recordId },  // Send the unique identifier
        });
        fetchData(selectedInterval); // Refresh data after deletion
        setMessage('Data deleted successfully');
    } catch (error) {
        console.error('Error deleting data:', error);
        setMessage('Error deleting data.');
    }
};
  

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
};

const handleDataChange = async (patientUID, index, field, value) => {
  let newEditableData = [...editableData[patientUID]];

  if (field === 'particulars') {
    const price = await fetchMedicinePrice(value);
    newEditableData[index] = { ...newEditableData[index], [field]: value, price: price, total: price * newEditableData[index].qty };
  } else if (field === 'qty') {
    const price = newEditableData[index].price;
    newEditableData[index] = { ...newEditableData[index], [field]: value, total: value * price };
  } else {
    newEditableData[index] = { ...newEditableData[index], [field]: value };
  }

  setEditableData(prevData => ({ ...prevData, [patientUID]: newEditableData }));
};


const fetchMedicineData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/pharmacy/data/');
    setMedicineOptions(response.data); // Assuming response.data is an array of medicines
  } catch (error) {
    console.error('Error fetching medicine data:', error);
  }
};

useEffect(() => {
  fetchMedicineData();
  // other dependencies...
}, []);

// Function to fetch the price of the selected medicine
const fetchMedicinePrice = async (medicine_name) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/pharmacy/medicine/${medicine_name}/price/`);
    return response.data.price; // Assuming the response contains a price field
  } catch (error) {
    console.error('Error fetching medicine price:', error);
    return 0;
  }
};

// Function to update total based on quantity and price
const updateTotal = (patientUID, dataIndex, newQty, price) => {
  const newTotal = newQty * price;
  setEditableData(prevData => {
    const newData = [...prevData[patientUID]];
    newData[dataIndex] = { ...newData[dataIndex], qty: newQty, total: newTotal };
    return { ...prevData, [patientUID]: newData };
  });
};


const saveChanges = async (patientUID, appointmentDate) => {
  try {
      await axios.put('http://127.0.0.1:8000/update/billing/data/', {
          patientUID: patientUID,
          appointmentDate: appointmentDate,
          table_data: editableData[patientUID],
      });
      fetchData(selectedInterval); // Refresh data after saving changes
      setMessage('Data updated successfully');
      toggleEditMode(); // Exit edit mode
  } catch (error) {
      console.error('Error updating data:', error);
      setMessage('Error updating data.');
  }
};

  return (
    <Container>
      <Header>
        <h3 className='text-center mb-2'>Billing Report</h3>
        <button title='Download Excel' onClick={downloadCSV}>
          <FaDownload />
        </button>
      </Header>
      <IntervalSelector>
        <ButtonGroup>
          <IntervalButton
            title='Daily Report'
            onClick={() => handleIntervalChange('date')}
            className={selectedInterval === 'date' ? 'active' : ''}
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
          {selectedInterval === 'date' && (
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
                  <th>Particulars</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>GST</th>
                  <th>Total</th>
                  <th>Edit & save</th>
                  <th>Remove</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
  {billingData && billingData.length > 0 ? (
    billingData.map((item, index) => (
      <React.Fragment key={item.patientUID}>
        {item.table_data && item.table_data.length > 0 ? (
          item.table_data.map((data, dataIndex) => (
            <tr key={`${item.patientUID}-${dataIndex}`}>
              {dataIndex === 0 && (
                <td rowSpan={item.table_data.length}>
                  {formatText(item.patientName)}
                </td>
              )}
              <td>
                {isEditing && editableData[item.patientUID] ? (
                  <select
                    value={editableData[item.patientUID][dataIndex]?.particulars || ''}
                    onChange={(e) =>
                      handleDataChange(item.patientUID, dataIndex, 'particulars', e.target.value)
                    }
                  >
                    {medicineOptions.map((medicine) => (
                      <option key={medicine.id} value={medicine.medicine_name}>
                        {medicine.medicine_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  data.particulars
                )}
              </td>
              <td>
                {isEditing && editableData[item.patientUID] ? (
                  <input
                    type="number"
                    value={editableData[item.patientUID][dataIndex]?.qty || ''}
                    onChange={(e) =>
                      handleDataChange(item.patientUID, dataIndex, 'qty', e.target.value)
                    }
                  />
                ) : (
                  data.qty
                )}
              </td>
              <td>
                {isEditing && editableData[item.patientUID] ? (
                  <input
                    type="number"
                    value={editableData[item.patientUID][dataIndex]?.price || ''}
                    onChange={(e) =>
                      handleDataChange(item.patientUID, dataIndex, 'price', e.target.value)
                    }
                  />
                ) : (
                  data.price
                )}
              </td>
              <td>
                {isEditing && editableData[item.patientUID] ? (
                  <input
                    type="number"
                    value={editableData[item.patientUID][dataIndex]?.gst || ''}
                    onChange={(e) =>
                      handleDataChange(item.patientUID, dataIndex, 'gst', e.target.value)
                    }
                  />
                ) : (
                  `${data.CGST_percentage}/${data.SGST_percentage}`
                )}
              </td>
              <td>
                {isEditing && editableData[item.patientUID] ? (
                  <input
                    type="number"
                    value={editableData[item.patientUID][dataIndex]?.total || ''}
                    onChange={(e) =>
                      handleDataChange(item.patientUID, dataIndex, 'total', e.target.value)
                    }
                  />
                ) : (
                  data.total
                )}
              </td>
              {dataIndex === 0 && (
                <td rowSpan={item.table_data.length}>
                  {isEditing ? (
                    <button onClick={() => saveChanges(item.patientUID, item.appointmentDate)}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => toggleEditMode(item.patientUID)}>
                      Edit
                    </button>
                  )}
                </td>
              )}
              {dataIndex === 0 && (
                <td rowSpan={item.table_data.length}>
                  <FaTrash
                    onClick={() => handleDelete(item.patientUID, item.appointmentDate)}
                    style={{ cursor: 'pointer', color: '#E26868' }}
                  />
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              No table data available
            </td>
          </tr>
        )}
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center">
        No data available
      </td>
    </tr>
  )}
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

export default BillingReport;

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

const DownloadButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2E97A7;
  font-size: 1.5rem;
  position: absolute;
  top: 70px;
  right: 0;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
`;
