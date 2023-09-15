import React, { use, useState, useEffect } from 'react'
import { utils, read } from 'xlsx'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BASE_URL } from './api/config';
import * as XLSX from 'xlsx';

import moment from "moment";

const Excel = () => {
  // const rowData = [];
  const columnDefs = [
    { headerName: 'EIRL', field: 'EIRL' },
    { headerName: 'Item No', field: 'Item' },
    { headerName: 'Subitem No', field: 'Subitem No' },
    { headerName: 'For Payment', field: 'For Payment' },
    { headerName: 'Date of Measurement', field: 'Date of Measurement' },
    { headerName: 'Particulars of Work', field: 'Particulars of Work' },
    { headerName: 'No.', field: 'No.' },
    { headerName: 'Length', field: 'Length' },
    { headerName: 'Breadth', field: 'Breadth' },
    { headerName: 'Depth', field: 'Depth' },
    { headerName: 'Quantity', field: 'Quantity' },
  ];
  const [excelData, setExcelData] = useState([]);
  const [excelError, setExcelError] = useState('');
  const [message, setMessage] = useState('');

  const file_type = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

  const handleChange = (e) => {
    const selected_file = e.target.files[0];

    if (selected_file) {
      if (selected_file && file_type.includes(selected_file.type)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          const workbook = read(e.target.result);
          const sheet = workbook.SheetNames;


          if (sheet.length) {
            const data = utils.sheet_to_json(workbook.Sheets[sheet[0]]);
            const headerNames = utils.sheet_to_json(workbook.Sheets[sheet[0]], {
              header: 1,
              range: 0, // Assuming the header is in the first row
            })[0];

            let msObj = {}
            for (let i = 7; i < headerNames.length; i++) {
              let tmp = headerNames[i]
              msObj[tmp] = ''
            }

            // console.log(msObj);
            let dummyData = [];
            let templateData = dropdownOptions.filter(item => item.tid == selectedOption);
            let measurement = templateData.length > 0 ? JSON.parse(templateData[0].measurement) : null;
            
            if (measurement !== null) {
              measurement.map(item=>item.key)
            } else {
              // Handle the case where templateData is empty
            }
            console.log(measurement);
            // let tmpObj = {}
            for (let i = 1; i < data.length; i++) {
              let tmp = i - 1
              let tmpObj = new Object();
              tmpObj.irl = data[i][headerNames[0]] ? data[i][headerNames[0]] : '';
              tmpObj.itemno = data[i][headerNames[1]] ? data[i][headerNames[1]] : dummyData[dummyData.length - 1].itemno;
              tmpObj.subitemno = data[i][headerNames[2]] ? data[i][headerNames[2]] : (dummyData.length > 0 ? dummyData[dummyData.length - 1].subitemno : '');
              tmpObj.payment = data[i][headerNames[3]] ? data[i][headerNames[3]] : '';
              tmpObj.no = data[i][headerNames[6]] ? data[i][headerNames[6]] : '';
              let currentDate = data[i][headerNames[4]] ? data[i][headerNames[4]] : dummyData[dummyData.length - 1].date;

              let formattedDate = moment(currentDate, 'DD-MM-YYYY').format('YYYY/MM/DD')
              if (formattedDate == 'Invalid date') {
                formattedDate = currentDate
              }

              tmpObj.date = formattedDate;

              tmpObj.type = selectedOption;
              tmpObj.partiwork = data[i][headerNames[5]] ? data[i][headerNames[5]] : '';
              var keys = Object.keys(msObj);
              let userMsObj = Object.assign({});
              for (let j = 0; j < keys.length; j++) {
                //  console.log(keys[j])
                userMsObj[keys[j]] = data[i][keys[j]]

              }
              tmpObj.measurement = JSON.stringify(userMsObj);
              // let demoArr = [];
              dummyData.push(tmpObj)
              //  dummyData=[dummyData, ...demoArr]
              // dummyData.push(tmpObj)

            }

            console.log(dummyData)
            setExcelData(dummyData);
          }
        }
        reader.readAsArrayBuffer(selected_file)
      } else {
        setExcelError('please upload only excel file')
        setExcelData([])
      }
    }
  }


  const handlePostData = async () => {
    let k = 0;

    try {
      const response = await fetch(BASE_URL + 'postmbd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: excelData }), // Replace with your actual data
      });
      const data = await response.json();
      if (response.isSuccess) {

        setMessage(data.message);
        console.log('data' + data);
      } else {
        // Handle errors here
        console.log(response)
        console.error('Failed to store data');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };


  const [dropdownOptions, setDropdownOptions] = useState(['option 1']);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedData, setSelectedData] = useState("");
  const [data, setData] = useState(false);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(BASE_URL + 'gettype', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can pass any necessary parameters to your API here
        // For example: body: JSON.stringify({ selectedOption }),
      });

      if (response.ok) {

        const datap = await response.json();
        // Update the dropdown options based on the fetched dat
        setDropdownOptions(datap); // Assuming your API response has an 'options' property
        //  console.log(datap)
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDropdownChange = (e) => {
    const selectedOption = e.target.value;

    setSelectedOption(selectedOption);
    setSelectedData(e.target.value)

  };
  let templateData = dropdownOptions.filter(item => item.tid == selectedOption);
  let measurement = templateData.length > 0 ? JSON.parse(templateData[0].measurement) : null;
  
  if (measurement !== null) {
    measurement.map(item=>item.key)
  } else {
    
  }
  console.log(measurement)

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      measurement.map(item=>item.label),
      measurement.map(item => item.key),

    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className='justify-center item-center flex flex-col m-10'>
      <div>
        <select value={selectedOption} onChange={handleDropdownChange} className='p-1 mx-8 ring-offset-2 ring-2 h-55 w-500'>
          <option value={0}>Select </option>
          {dropdownOptions.map((option) => (
            <option key={option.tid} value={option.tid}>
              {option.name}

            </option>
          ))}
        </select>
        {selectedOption ?
          <div>
            <button className='p-1 mx-40 ring-offset-2 ring-2 h-55 w-500'
              onClick={exportToExcel}>
              Download Template
            </button>
          </div> : <div></div>}
        <br />
        {data ?
          <div className="my-2">
            <p>{selectedData}</p>
          </div> : <></>
        }
      </div>
      <div>
        <input type='file'
          className='p-1 mx-8 ring-offset-2 ring-2'
          onChange={handleChange}
        />
      </div>
      <br />

      <br />
      <button className='border w-80 shadow-xl ring-offset-2 ring-2' onClick={handlePostData}>Store Data</button>
      <p>{message}</p>
      <br />
      <br />
    </div>
  )
}

export default Excel
