import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import AllFeatures from './AllFeatures';
//import './Custom-react-data-grid.css'
import { BASE_URL } from './api/config';



const mb = () => {
  const [dateList, setDateList] = useState([]);
  const [typeDate, setTypeData] = useState([])
  const fetchData = async () => {
    try {
      const response = await fetch(BASE_URL + 'gettype', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       
      });

      if (response.ok) {
        
        const datap = await response.json();
    
        setTypeData(datap); // Assuming your API response has an 'options' property
    
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getCardData = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.2:3002/getAllDate`
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
  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
   
  }, []);
  useEffect(() => {
  
    getCardData();
  }, []);

  const CustomHeaderRowRenderer = () => {
    // Render an empty header row to hide the header
    return null;
  };
  return (
    <div >
    {dateList.map((item)=> <AllFeatures {...item} typeDate={typeDate}></AllFeatures> ) }
     
    
    </div>
  );
};

export default mb;



