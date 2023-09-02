import mongoose from 'mongoose';

const formulaSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  limit: { type: String, required: true },
  unit: { type: String, required: true },
});

export default mongoose.model('Formula', formulaSchema);