import { useState } from "react";

function FormulaForm() {
  const [formulaName, setFormulaName] = useState('');
  const [formula, setFormula] = useState('');
  const [template, setTemplate] = useState([]);
  const [errors, setErrors] = useState({ template: [] });

  const handleNumRowsChange = (event) => {
    let tmpArr = [];
    for (let i = 0; i < event.target.value; i++) {
      let tmpObj = {
        id: i,
        key: '',
        label: '',
        limit: '',
        unit: '',
        defaultValue: ''
      }
      tmpArr.push(tmpObj)
    }
    setTemplate(tmpArr);
    console.log(tmpArr);
  };

  const updateValue = (e, updateFor, id) => {
    console.log("Value" + e.target.value);
    console.log('Update for' + updateFor);
    console.log('id' + id);

    template[id][updateFor] = e.target.value;
    setTemplate([...template]);
    validateTemplate();
    console.log(JSON.stringify(template))
  }

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
      if (!item.defaultValue.trim()) {
        itemErrors.defaultValue = 'DefaultValue is required';
        valid = false;
      }

      newTemplateErrors.push(itemErrors);
    });

    setErrors({ ...errors, template: newTemplateErrors });
    return valid;
  }

  const handleSubmit = () => {
    const isTemplateValid = validateTemplate();
  
    if (isTemplateValid && formulaName.trim() && formula.trim()) {
      console.log("Form is valid");
    }
  }
  const renderError = (field, index) => {
    const error = errors.template[index] && errors.template[index][field];
    return error ? <div className="text-red-500">{error}</div> : null;
  };

  return (
    <div className="m-5">
      <div className='flex flex-col sm:w-full'>
        <div className='my-2'>
          <label>Formula Name:</label>
          <input
            className='p-1 mx-8 ring-offset-2 ring-2'
            placeholder='e.g., Enter Formula name'
            value={formulaName}
            onChange={(e) => setFormulaName(e.target.value)}
          />
        </div>
        <div className='my-2'>
          <label>Formula:</label>
          <input
            className='p-1 mx-20 ring-offset-2 ring-2'
            placeholder='e.g., Enter a formula'
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </div>
        <div className='my-2'>
          <label>Number of Rows:</label>
          <input
            type="number"
            className='p-1 mx-5 ring-offset-2 ring-2'
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
                <label>label</label>
                <label>limit</label>
                <label>unit</label>
                <label>defaultValue</label>
                <br/>
                </div> 
                : ""}
               <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].key
                    ? "ring-red-500"
                    : ""
                  }`}
                onChange={(e) => updateValue(e, "key", item.id)}
              />
              {/* {renderError("key", index)} */}
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
              <input
                className={`p-1 m-2 ring-offset-2 ring-2 ${errors.template[index] && errors.template[index].defaultValue
                    ? "ring-red-500"
                    : ""
                  }`}
                onChange={(e) => updateValue(e, "defaultValue", item.id)}
              />
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
      </div>
    </div>
  );
}

export default FormulaForm;