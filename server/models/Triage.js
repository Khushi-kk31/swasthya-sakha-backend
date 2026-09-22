import mongoose from 'mongoose';

const triageSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      default: null,
      index: true
    },
    symptomsText: {
      type: String,
      default: '',
      trim: true
    },
    selectedSymptoms: [
      {
        type: String,
        trim: true
      }
    ],
    mewsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 15
    },
    triageLevel: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      required: true,
      uppercase: true
    },
    department: {
      type: String,
      default: 'General Medicine'
    },
    recommendation: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'en-IN'
    },
    source: {
      type: String,
      enum: ['indicbert', 'fallback'],
      default: 'indicbert'
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

const Triage = mongoose.models.Triage || mongoose.model('Triage', triageSchema);

export default Triage;