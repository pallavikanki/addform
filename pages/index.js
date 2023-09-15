import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { BASE_URL } from './api/config';
function Home() {
  const [formulaName, setFormulaName] = useState('');
  const [quantityName,setQuantityName] = useState('');
  const [template, setTemplate] = useState([]);
  const [errors, setErrors] = useState({ template: [] });
  const [exportError, setExportError] = useState(null);
  // const router=useRouter();

  const handleNumRowsChange = (event) => {
    let tmpArr = [];
    for (let i = 0; i < event.target.value; i++) {
      let tmpObj = {
        id: i,
        key: '',
        label: '',
        limit: '',
        unit: '',
        type: ''
      }
      tmpArr.push(tmpObj)
    }
    setTemplate(tmpArr);
    console.log(tmpArr);
  };


  const updateValue = (e, updateFor, id) => {
    const updatedTemplate = template.map((item) => {
      if (item.id === id) {
        return { ...item, [updateFor]: e.target.value };
      }
      return item;
    });

    setTemplate(updatedTemplate);
    validateTemplate(updatedTemplate);
  };


  const validateTemplate = () => {
    let valid = true;
    const newTemplateErrors = [];

    template.forEach((item, index) => {
      const itemErrors = {};
      if (!item.key.trim()) {
        itemErrors.key = 'Key is required';
        valid = false;
      }
      if (!item.label.trim()) {
        itemErrors.label = 'Label is required';
        valid = false;
      }
      if (!item.limit.trim()) {
        itemErrors.limit = 'Limit is required';
        valid = false;
      }
      if (!item.unit.trim()) {
        itemErrors.unit = 'Unit is required';
        valid = false;
      }
      if (!item.type) {
        itemErrors.type = 'Type is required';
        valid = false;
      }

      newTemplateErrors.push(itemErrors);
    });

    setErrors({ ...errors, template: newTemplateErrors });
    return valid;
  }

  const handleSubmit = async () => {
    const isTemplateValid = validateTemplate();
    if (isTemplateValid && formulaName.trim() && quantityName.trim()) {
      let Measurement = JSON.stringify(template)
      let mdata = {
        measurement: Measurement,
        name: formulaName,
        quantity:quantityName,
      }
      try {
        const response = await fetch(BASE_URL + 'posttype', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: mdata }), 
        });
        const data = await response.json();
        if (response.isSuccess) {

          setMessage(data.message);
          console.log('data' + data);
        } else {
          
          console.log(response)
          console.error('Failed to store data');
        }
      } catch (error) {
        console.error('Error:', error);
      }


      // console.log("Form is valid");
      // localStorage.setItem("formulaTemplate", JSON.stringify(template));
      // localStorage.setItem("formula Name", formulaName);
      // router.push('/FormulaForm');
    }
  }
  const options = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "isFormula", label: "IsFormula" }
  ];
  const tmp = [
    { key: '', label: 'Eirl' },
    { key: '', label: 'Item No' },
    { key: '', label: 'Subitem No' },
    { key: '', label: 'For Payment' },
    { key: '', label: 'Date of Measurement' },
    { key: '', label: 'Particulars of Work' },
    { key: '', label: 'No.' }
  ];
  let template1 = [...tmp, ...template]
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      template1.map(item => item.label),
      template1.map(item => item.key),
      template1.map(item => item.unit),
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
    setExportError(null);
  };

  return (
    <div className="m-5">
      <div className='flex flex-col sm:w-full'>
        <div className='my-2'>
          <label>Formula Name:</label>
          <input
            className='p-1 mx-6 ring-offset-2 ring-2'
            placeholder='e.g., Enter Formula name'
            value={formulaName}
            onChange={(e) => setFormulaName(e.target.value)}
          />
        </div>
        <div className='my-2'>
          <label>Quantity</label>
          <input
            className='p-1 mx-16 ring-offset-2 ring-2'
            placeholder='e.g., Enter Quantity'
            value={quantityName}
            onChange={(e) => setQuantityName(e.target.value)}
          />
        </div>
        <div className='my-2'>
          <label>Number of Rows:</label>
          <input
            type="number"
            className='p-1 mx-3 ring-offset-2 ring-2'
            placeholder="Enter the number of rows"
            onChange={handleNumRowsChange}
          />
        </div>
        {template.map((item, index) => {
          return (
            <div key={index} style={{ padding: 10 }}>
              {item.id === 0 ?
                <div className="flex space-x-40  mx-20 ">
                  <label>Key</label>
                  <label>Label</label>
                  <label>Limit</label>
                  <label>Unit</label>
                  <label>Type</label>
                  <br />
                </div>
                : ""}
              <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].key
                  ? "ring-red-500"
                  : ""
                  }`}
                onChange={(e) => updateValue(e, "key", item.id)}
              />
              <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].label
                  ? "ring-red-500"
                  : ""
                  }`}
                onChange={(e) => updateValue(e, "label", item.id)}
              />
              <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].limit
                  ? "ring-red-500"
                  : ""
                  }`}
                onChange={(e) => updateValue(e, "limit", item.id)}
              />
              <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].unit
                  ? "ring-red-500"
                  : ""
                  }`}
                onChange={(e) => updateValue(e, "unit", item.id)}
              />
              <select
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].type
                  ? "ring-red-500"
                  : ""
                  }`}
                value={item.type}
                onChange={(e) => updateValue(e, "type", item.id)}
              >
                <option value="">Select an option</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      <div className='my-2'>
        <button
          className='border w-80 shadow-xl ring-offset-2 ring-2'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div><br />
      <div>
        <button
          className='border w-80 shadow-xl ring-offset-2 ring-2'
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default Home;