import mongoose from 'mongoose';

const triageSchema = new mongoose.Schema({
  symptomsText: { type: String, default: '' },
  selectedSymptoms: [{ type: String }],
  mewsScore: { type: Number, required: true },
  triageLevel: { type: String, enum: ['GREEN', 'YELLOW', 'RED'], required: true },
  language: { type: String, default: 'en-IN' },
  createdAt: { type: Date, default: Date.now }
});

const Triage = mongoose.models.Triage || mongoose.model('Triage', triageSchema);
export default Triage;