import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import AllFeatures from './AllFeatures';
//import './Custom-react-data-grid.css'



const mb = () => {
  const [dateList, setDateList] = useState([]);

  
  const getCardData = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.10:3002/getAllDate`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      setDateList(data);
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
    {dateList.map((item)=> <AllFeatures {...item}></AllFeatures> ) }
    
    
    </div>
  );
};

export default mb;



