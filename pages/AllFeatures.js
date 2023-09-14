import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
//import 'react-data-grid/styles.css';
import 'react-data-grid/lib/styles.css';
import moment from"moment";





const AllFeatures = ({wdate,type,itemno,typeDate}) => {
    
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [tableColums,SetTableColums] = useState([])


  function isAtBottom({ currentTarget }){
    return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
  }
  async function handleScroll(event) {
    if (loading || !isAtBottom(event)) return;

    setLoading(true);
     fetchData();
  }

  useEffect(()=>{
    let columns = [
      { key: 'date', name: 'Date', width: 200 },
      { key: 'partiwork', name: 'Particulars of work', width: 200 },
      { key: 'no', name: 'No.', width: 100 },
    
      
    ];
   let typeDetail= typeDate.filter(item=>item.tid==type);
   if(typeDetail.length>0){
    let  measurement =JSON.parse(typeDetail[0].measurement);
    for (let i=0 ; i<measurement.length;i++){
       let msObj = {key:measurement[i].label,name:measurement[i].label,width:150 }
       columns.push(msObj)
    
    }
    columns.push({ key: 'Quantity', name: 'Quantity', width: 150 })
   
    SetTableColums(columns)
   
    
    fetchData();
  }
  },[])

  const fetchData = async () => {
    setLoading(true);
    let  formattedDate = moment(wdate, 'DD-MM-YYYY').format('YYYY/MM/DD')
    // Simulate an API call to fetch data
    try {
      const response = await fetch(`http://192.168.1.2:3002/getdateWiseData?wdate=${formattedDate}&itemno=${itemno}&type=${type}&page=${page}`);
      const data = await response.json();
      
      // Append the newly loaded data to the existing rows
      setRows([...rows, ...data]);
      let currentPage= page +1
      
      setPage(currentPage);
      console.log(page)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:10}}>
    <p>Item Id: {rows.length>0?rows[0].itemno:0} </p>
    
      <DataGrid
        columns={tableColums}
        rows={rows}
        onScroll={handleScroll}
        style={{ height :rows.length<10?(rows.length*35)+50+'px':'400px' }}
        loading={loading} // Display a loading indicator
      />
      {/* {loading && <div style={{position:'absolute',width:'100%',height:50,backgroundColor:'rgb(0 0 0 / 0.6)',textAlign:'center'}}>
        Loading more rows...
        </div>} */}
        <div>
           Records: {rows.length} /{rows.length>0?rows[0].count:0} 
        </div>
    </div>
  );
};

export default AllFeatures;
