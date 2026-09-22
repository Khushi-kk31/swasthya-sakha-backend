import express from 'express';
import Triage from '../models/Triage.js';


const router = express.Router();
const INDICBERT_URL =
  process.env.INDICBERT_URL || 'http://127.0.0.1:8000';

// Helper function to send text to local Python IndicBERT service
async function parseWithLocalIndicBERT(text, language) {
  try {
    const res = await fetch(`${INDICBERT_URL}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, language })
    });

    const data = await res.json();

    return data.triageLevel || 'GREEN';
  } catch (err) {
    console.error(
      'IndicBERT service unreachable:',
      err.message
    );

    return 'GREEN';
  }
}
router.post('/submit', async (req, res) => {
  try {
    const { symptomsText, selectedSymptoms, totalScore, language } = req.body;

    let triageLevel = 'GREEN';

    // 1. If text/voice input is present, prioritize IndicBERT parsing
    if (symptomsText && symptomsText.trim().length > 0) {
      triageLevel = await parseWithLocalIndicBERT(symptomsText, language);
    } 
    // 2. If no text input, fallback to icon selection MEWS score
    else {
      if (totalScore >= 4) triageLevel = 'RED';
      else if (totalScore >= 2) triageLevel = 'YELLOW';
    }

    const triageRecord = new Triage({
      symptomsText,
      selectedSymptoms,
      mewsScore: totalScore || 0,
      triageLevel,
      language
    });

    await triageRecord.save();

    return res.status(201).json({
      success: true,
      message: 'Triage assessment saved successfully',
      data: triageRecord
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all recent triage submissions
router.get('/all', async (req, res) => {
  try {
    const records = await Triage.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;