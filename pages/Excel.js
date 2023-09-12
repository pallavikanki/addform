import React, { use, useState } from 'react'
import { utils , read } from 'xlsx'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BASE_URL } from './api/config';

import moment from"moment";

const Excel = () => {
  // const rowData = [];
  const columnDefs = [
    { headerName: 'EIRL', field:'EIRL'},
    { headerName: 'Item No', field:'Item'},
    { headerName: 'Subitem No', field:'Subitem No'},
    { headerName: 'For Payment', field:'For Payment'},
    { headerName: 'Date of Measurement', field:'Date of Measurement'},
    { headerName: 'Particulars of Work', field:'Particulars of Work'},
    { headerName: 'No.', field:'No.'},
    { headerName: 'Length', field:'Length'},
    { headerName: 'Breadth', field:'Breadth'},
    { headerName: 'Depth', field:'Depth'},
    { headerName: 'Quantity', field:'Quantity'},
  ];
    const [excelData, setExcelData]=useState([]);
    const [excelError, setExcelError]=useState('');
    const [message, setMessage] = useState('');
   //let demoDate=  moment('15-04-2022').format('YYYY/DD/MM');

   const formattedDate = moment('2022/15/04', 'DD-MM-YYYY').format('YYYY/DD/MM');
   console.log(formattedDate);
   //console.log(formattedDate);
   //console.log(demoDate);
    const file_type=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel']
    const handleChange = (e) =>{
      const selected_file=e.target.files[0];

      if(selected_file){
        if(selected_file && file_type.includes(selected_file.type)){
          let reader = new FileReader();
          reader.onload=(e)=>{
            const workbook =read(e.target.result);
            const sheet=workbook.SheetNames;
            
    
            if(sheet.length){
                const data =utils.sheet_to_json(workbook.Sheets[sheet[0]]);
                const headerNames = utils.sheet_to_json(workbook.Sheets[sheet[0]], {
                  header: 1,
                  range: 0, // Assuming the header is in the first row
                })[0];
               
                let msObj = {}
                for(let i=7;i<headerNames.length;i++){
                  let tmp= headerNames[i]
                  msObj[tmp]   = ''
                }
                // console.log(msObj);
                let dummyData= [];
                // let tmpObj = {}
                for(let i=1; i<data.length;i++){
                  let tmp = i-1
                  let tmpObj = new Object();
                  tmpObj.irl =data[i][headerNames[0]]?data[i][headerNames[0]]:'';
                  tmpObj.itemno=data[i][headerNames[1]]?data[i][headerNames[1]]:dummyData[dummyData.length-1].itemno ;
                  tmpObj.subitemno = data[i][headerNames[2]] ? data[i][headerNames[2]] : (dummyData.length > 0 ? dummyData[dummyData.length - 1].subitemno : '');
                  tmpObj.payment =data[i][headerNames[3]]?data[i][headerNames[3]]:'';
                  tmpObj.no =data[i][headerNames[6]]?data[i][headerNames[6]]:'';
                  let currentDate = data[i][headerNames[4]]?data[i][headerNames[4]]:  dummyData[dummyData.length-1].date ;
                  
                  let  formattedDate = moment(currentDate, 'DD-MM-YYYY').format('YYYY/MM/DD')
                if(formattedDate == 'Invalid date'){
                  formattedDate =currentDate
                }

                tmpObj.date  = formattedDate;
                 
                  tmpObj.type =1;
                  tmpObj.partiwork =data[i][headerNames[5]]?data[i][headerNames[5]]:'';
                  var keys = Object.keys(msObj);
                  let userMsObj = Object.assign({});
                  for(let j=0;j<keys.length;j++){
                    //  console.log(keys[j])
                     userMsObj[keys[j]]= data[i][keys[j]]

                  }
                  tmpObj.measurement= JSON.stringify(userMsObj);
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
        }else{
           setExcelError('please upload only excel file')
           setExcelData([])
        }
        
      }
    }
    

  const handlePostData = async () => {
    let k=0;
    
      // let tmpArr = []
      // for(let j=0; j<10; j++){
      //   tmpObj = excelData[j]
      // //  tmpArr.push()
      // }
    
    try {
      const response = await fetch(BASE_URL+'postmbd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: excelData }), // Replace with your actual data
      });
      const data = await response.json();
      if (response.isSuccess) {
        
        setMessage(data.message);
        console.log('data'+data);
      } else {
        // Handle errors here
        console.log(response)
        console.error('Failed to store data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
  };

  return (
    <div className='justify-center item-center flex flex-col m-10'>
        <div>
            <input type='file'
            className='p-1 mx-8 ring-offset-2 ring-2'
            onChange={handleChange}
            />
        </div>
        <br/>
        <br/>
        <button className='border w-80 shadow-xl ring-offset-2 ring-2' onClick={handlePostData}>Store Data</button>
      <p>{message}</p>
      <br/>
        <br/>
         {/* <div className="ag-theme-alpine" style={{ height: 600, width: 1400 }}>
         <AgGridReact
           rowData={excelData}
           columnDefs={columnDefs}/>
               </div>   */}
    </div>
  )
}

export default Excel
