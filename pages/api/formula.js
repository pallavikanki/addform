// pages/api/formula.js
export default function handler(req, res) {
    const { input1, input2 } = req.body;
    
    // Perform your formula calculation using input1 and input2
    const result = input1 * input2; // This is just an example
  
    res.status(200).json({ result });
  }
  