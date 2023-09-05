import { useEffect, useState } from "react";
//import Structure from './Structure'
const FormulaForm = () => {
  const [sum, setSum] = useState(0);
  const [result, setResult] = useState(0);
  const [multi, setMulti] = useState(0);
  const [template, setTemplate] = useState([])
  const [formulaName, setFormulaName] = useState('')
  const [formula, setFormula] = useState('')
  useEffect(() => {
    const fetchFormula = async () => {
      let formulaTemplate = JSON.parse(localStorage.getItem("formulaTemplate"));

      let formulaName = localStorage.getItem("formula Name");
      let formula = localStorage.getItem("formula");
      setTemplate(formulaTemplate)
      setFormulaName(formulaName)
      setFormula(formula)
    }
    
    fetchFormula();
  }, [])
  const textChangeEvent = (e, item) => {
    template[item.id].value = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0;
    setTemplate(template)
    console.log(JSON.stringify(template))
    calculateSum();
    calculateMulti();
   
  }
  // Use Object.values() to get an array of values from the JSON object
  const value = Object.values(template);
  // Calculate the sum of values and update the state
  const calculateSum = () => {
    const total = value.reduce((acc, curr) => (acc ? acc : 0) + curr.value, 0);
    setSum(total);
  };
  const calculateMulti = () => {
    const m = value.reduce((acc, curr) => (acc ? acc : 1) * curr.value, 0);
    setMulti(m);
  };
  const jsonString = JSON.stringify(template);
  console.log(jsonString)
  function isStringInJsonObjectKey(formula, jsonObject) {
    let m = formula;
    {
      template.length > 0 && (
        template.map((item) => {
          console.log(item.key)
          console.log(formula.includes(item.key))
          if (formula.includes(item.key)) {
            m = m.replace(item.key, item.value)
            console.log("ghkg" + m)
            localStorage.setItem("formul", m);
            
          }
        }
        ))
    }
    
    return false; // No match found
   
  }



  if (isStringInJsonObjectKey(formula, jsonString)) {  
    console.log(`String "${formula}" matches a JSON object key.`);
  } else {
    console.log(`String "${formula}" does not match any JSON object key.`);
  }
  const handleCalculate = () => {
    try {
      let field = localStorage.getItem("formul");
      setResult(eval(field).toString());
    } catch (error) {
      setResult('0');
    }
  };



  return (
    <div className='m-40'>
      <div className='my-2'>
        <p> <label>Name: {formulaName}</label></p>
        <p> <label>Formula: {formula}</label></p>

      </div>
      {template.length > 0 && (
        template.map((item) => {
          return (
            <div key={item.key} className='p-2'>
              <label className='my-2' key={item.key}>{item.label}</label> <input className='p-1 mx-2 ring-offset-2 ring-2'
                placeholder={"Enter " + item.label} onChange={(e) => {
                  textChangeEvent(e, item)
                }} />
              <label>{item.unit}</label>

            </div>
          )
        }))
      }
      <div className='my-2'>
      <button
          className='border w-80 shadow-xl ring-offset-2 ring-2'
          onClick={handleCalculate}
        >
          Submit
        </button><br/><br/>
        <label>Calculate Addition Value:{result}
        </label> <br/><br/>
        <label>Calculation :{multi}
        </label>
      </div>
    </div>
  )
}

export default FormulaForm;