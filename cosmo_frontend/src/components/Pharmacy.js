import React, { useState, useEffect } from 'react';
import { Form, Container, Table, Button, Alert } from 'react-bootstrap';
import { FaDownload } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import styled from 'styled-components';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Pharmacy = () => {
  const [lowQuantityMedicines, setLowQuantityMedicines] = useState([]);
  const [nearExpiryMedicines, setNearExpiryMedicines] = useState([]);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/check_medicine_status/')
      .then(response => {
        setLowQuantityMedicines(response.data.low_quantity_medicines);
        setNearExpiryMedicines(response.data.near_expiry_medicines);
      })
      .catch(error => {
        console.error('There was an error fetching the medicine status:', error);
      });
  }, []);

  const togglePanel = () => {
    setPanelVisible(!panelVisible);
  };

  const hasNotifications = lowQuantityMedicines.length > 0 || nearExpiryMedicines.length > 0;

  const [formData, setFormData] = useState([
    {
      medicineName: '',
      companyName: '',
      price: '',
      newStock: '',
      oldStock: '',
      receivedDate: '',
      expiryDate: '',
      batchNumber: ''
    }
  ]);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/pharmacy/data/')
      .then((response) => {
        if (response.data.length === 0) {
          setFormData([
            {
              medicineName: '',
              companyName:'',
              price: '',
              newStock: '',
              oldStock: '',
              receivedDate: '',
              expiryDate: '',
              batchNumber: ''
            }
          ]);
        } else {
          setFormData(
            response.data.map((item) => ({
              medicineName: item.medicine_name,
              companyName: item.company_name,
              price: item.price.toString(),
              newStock: '',
              oldStock: item.old_stock.toString(),
              receivedDate: item.received_date,
              expiryDate: item.expiry_date,
              batchNumber: item.batch_number
            }))
          );
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data:', error);
      });
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    newFormData[index][name] = value;
  
    if (name === 'newStock') {
      const newStockValue = value ? parseInt(value, 10) : 0;
      const initialOldStock = parseInt(formData[index].oldStock, 10) || 0;
      newFormData[index].oldStock = (initialOldStock + newStockValue).toString();
    }
  
    setFormData(newFormData);
  };

  const handleKeyPress = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewRow();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = formData.map((item) => ({
      medicine_name: item.medicineName,
      company_name: item.companyName,
      price: item.price,
      new_stock: item.newStock ? parseInt(item.newStock, 10) : 0,
      received_date: formatDate(item.receivedDate),
      expiry_date: formatDate(item.expiryDate),
      batch_number: item.batchNumber,
      old_stock: parseInt(item.oldStock, 10)
    }));

    const method = formattedData.every(item => item.old_stock === 0) ? 'POST' : 'PUT';

    axios({
      method: method,
      url: 'http://127.0.0.1:8000/pharmacy/data/',
      data: formattedData,
    })
      .then((response) => {
        console.log('Data submitted successfully:', response.data);
        setSubmitSuccess(true);
        setSubmitError(null);
      })
      .catch((error) => {
        console.error('There was an error submitting the form:', error);
        setSubmitError('There was an error submitting the form.');
        setSubmitSuccess(false);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const addNewRow = () => {
    setFormData([
      ...formData,
      {
        medicineName: '',
        companyName: '',
        price: '',
        newStock: '',
        oldStock: '',
        receivedDate: '',
        expiryDate: '',
        batchNumber: ''
      }
    ]);
  };

  const removeRow = (index) => {
    const medicineName = formData[index].medicineName;
  
    axios.delete(`http://127.0.0.1:8000/pharmacy/data/${medicineName}/`)
      .then(response => {
        console.log('Medicine deleted successfully:', response.data);
        const newFormData = [...formData];
        newFormData.splice(index, 1);
        setFormData(newFormData);
      })
      .catch(error => {
        console.error('There was an error deleting the medicine:', error);
      });
  };
  

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pharmacy Data");
    XLSX.writeFile(workbook, "pharmacy_data.xlsx");
  };

  return (
    <div>
      <NotificationIcon onClick={togglePanel}>
        <FaRegBell />
        {hasNotifications && <RedDot />}
      </NotificationIcon>

      <NotificationPanel visible={panelVisible}>
        <CloseIcon onClick={togglePanel}><IoMdClose /></CloseIcon>
        <h4 className="mb-3">Notifications</h4>

        {lowQuantityMedicines.length > 0 && (
          <Alert style={{backgroundColor:"#F1F1F1",border:"#C7B7A3"}} className="mb-3">
            <center><Alert.Heading style={{color:"#B3A398",fontSize:"1.2rem",fontFamily:"cursive"}}>Low Stock Medicines</Alert.Heading></center>
            <ul style={{fontSize:"0.9rem",fontFamily:"initial",color:"#C7B7A3"}}>
              {lowQuantityMedicines.map((medicine, index) => (
                <li key={index}>
                  {medicine.medicine_name} - Stock: {medicine.old_stock} - Expiry Date: {medicine.expiry_date}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {nearExpiryMedicines.length > 0 && (
          <Alert style={{backgroundColor:"#F1F1F1",border:"#C7B7A3"}}>
            <center><Alert.Heading style={{color:"#B3A398",fontSize:"1.2rem",fontFamily:"cursive"}}>Near Expiry Medicines</Alert.Heading></center>
            <ul style={{fontSize:"0.9rem",fontFamily:"initial",color:"#C7B7A3"}}>
              {nearExpiryMedicines.map((medicine, index) => (
                <li key={index}>
                  {medicine.medicine_name} - Stock: {medicine.old_stock} - Expiry Date: {medicine.expiry_date}
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </NotificationPanel>

      <StyledContainer>
        <h3 className="text-center mb-4">Pharmacy Stock</h3>
        {submitSuccess && (
          <SuccessMessage>Pharmacy data submitted successfully!</SuccessMessage>
        )}
        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
        <button style={{float:"right",marginRight:"20px",marginTop:"-60px"}} title='Download Excel' onClick={downloadExcel}>
          <FaDownload />
        </button>
        <Form onSubmit={handleSubmit}>
          <TableContainer>
            <StyledTable striped bordered hover>
              <thead>
                <tr style={{whiteSpace:"nowrap"}}>
                  <th>Medicine Name</th>
                  <th>Company Name</th>
                  <th>Price</th>
                  <th>New Stock</th>
                  <th>Old Stock</th>
                  <th>Received Date</th>
                  <th>Expiry Date</th>
                  <th>Batch Number</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {formData.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter medicine name"
                        name="medicineName"
                        value={data.medicineName}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter company name"
                        name="companyName"
                        value={data.companyName}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter price"
                        name="price"
                        value={data.price}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter new stock"
                        name="newStock"
                        value={data.newStock}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter old stock"
                        name="oldStock"
                        value={data.oldStock}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="date"
                        placeholder="Enter received date"
                        name="receivedDate"
                        value={data.receivedDate}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="date"
                        placeholder="Enter expiry date"
                        name="expiryDate"
                        value={data.expiryDate}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td>
                      <StyledFormControl
                        type="text"
                        placeholder="Enter batch number"
                        name="batchNumber"
                        value={data.batchNumber}
                        onChange={(e) => handleChange(index, e)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                      />
                    </td>
                    <td style={{textAlign:"center"}}>
                      <RemoveIcon>
                        <RiDeleteBin5Line onClick={() => removeRow(index)} title='Delete Row'/>
                      </RemoveIcon>
                    </td> 
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
          <ButtonContainer>
            <button style={{fontSize:"1.5rem",marginRight:"10px"}} onClick={addNewRow} variant="success" type="button">+</button>
            <button style={{marginRight:"5px"}} variant="primary" type="submit">Submit </button>
          </ButtonContainer>
        </Form>
      </StyledContainer>
    </div>
  );
};

const StyledContainer = styled(Container)`
  margin-top: -50px;
`;

const TableContainer = styled.div`
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
`;

const StyledTable = styled(Table)`
  width: 100%;
  thead th {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 100;
    text-align: center;
  }
`;

const StyledFormControl = styled(Form.Control)`
  min-width: 120px;
`;

const SuccessMessage = styled(Alert).attrs({
  variant: 'success',
})`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorMessage = styled(Alert).attrs({
  variant: 'danger',
})`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const NotificationIcon = styled.div`
  position: fixed;
  top: 20px;
  right: 60px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1100;

  svg {
    font-size: 2rem;
    color: grey;
  }

  &:hover {
    svg {
      color: black;
    }
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
`;

const NotificationPanel = styled.div`
  position: fixed;
  right: 0;
  width: 400px;
  height: 90%;
  background-color: white;
  box-shadow: -1px 0px 7px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: translateX(${props => (props.visible ? '0' : '100%')});
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  border-radius: 10px;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
    color: black;
  }

  &:hover {
    svg {
      color: gray;
    }
  }
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;


const RemoveIcon = styled.div`
  color: red;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
  }

  &:hover {
    color: darkred;
  }
`;


export default Pharmacy;
