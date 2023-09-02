import { useState } from "react";
import Structure from './Structure'
const Home = () => {
 const [sum, setSum] = useState(0);
 const [multi, setMulti] = useState(0);
  const [template, setTemplate] = useState(Structure)
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

  return (
    <div className='m-40'>
      <div className='my-2'>
        <label>Formula:</label> <input className='p-1 mx-2 ring-offset-2 ring-2'
          valuer='eg: Enter a formula' />
      </div>
      {
        Structure.map((item) => {
          return (
            <div key={item.key} className='p-2'>
              <label className='my-2' key={item.key}>{item.label}</label> <input className='p-1 mx-2 ring-offset-2 ring-2'
                placeholder='eg: Enter a formula' onChange={(e) => {
                  textChangeEvent(e, item)
                }} />

            </div>
          )
        })
      }
      <div className='my-2'>
        <label>Calculate Addition Value:{sum}
        </label> <br/>
        <label>Calculate multiplication Value:{multi}
        </label> 
      </div>
    </div>
  )
}

export default Home
