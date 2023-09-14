import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
//import './Custom-react-data-grid.css'



const Display = () => {
  const [card, setCard] = useState([]);

  const columns = [
    { key: 'date', name: 'Date', width: '50%' },
   
    { key: 'partiwork', name: 'Particulars of work', width: 200 },
    { key: 'no', name: 'No.', width: 50 },
    { key: 'Length', name: 'Length', width: 150 },
    { key: 'Breadth', name: 'Breadth', width: 150 },
    { key: 'Depth', name: 'Depth', width: 150 },
    { key: 'Quantity', name: 'Quantity', width: 150 },
    { key: 'unit', name: 'Unit', width: 50 },
  ];

  const columns1= [
    { key: 'date', name: '', width: '15%' },
   
    { key: 'partiwork', name: '', width: 200 },
    { key: 'no', name: '', width: 50 },
    { key: 'Length', name: '', width: 150 },
    { key: 'Breadth', name: '', width: 150 },
    { key: 'Depth', name: '', width: 150 },
    { key: 'Quantity', name: '', width: 150 },
    { key: 'unit', name: '', width: 50 },
  ];

  const getCardData = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.19:3002/getdateWiseData?wdate=2022-04-05&itemno=1&type=1&page=1`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      setCard(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCardData();
  }, []);

  const CustomHeaderRowRenderer = () => {
    // Render an empty header row to hide the header
    return null;
  };
  return (
    <div >
      <div >
        <h1>Total Record : {card.length}</h1>
        <div style={{width:'90%',marginLeft:'5%',padding:10}}> 
          <DataGrid columns={columns}   rows={card} rowHeight={30}
         
           />
        </div>
        <div style={{width:'100%;height:20px'}}></div>
        <div style={{width:'90%',marginLeft:'5%',padding:10}}> 
          <DataGrid columns={columns1} rows={card} rowHeight={30}
        
           />
        </div>
        <div style={{width:'100%;height:20px'}}></div>
        <div style={{width:'90%',marginLeft:'5%',padding:10}}> 
          <DataGrid columns={columns} rows={card} rowHeight={30}
        
           />
        </div>
      </div>
    </div>
  );
};

export default Display;

