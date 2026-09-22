import express from 'express';
import Triage from '../models/Triage.js';

const router = express.Router();

const INDICBERT_URL =
  process.env.PYTHON_SERVICE_URL ||
  process.env.INDICBERT_URL ||
  'https://indicbert-service.onrender.com';

async function parseWithLocalIndicBERT(text, language) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${INDICBERT_URL}/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    return data.triageLevel || 'GREEN';
  } catch (err) {
    console.error('IndicBERT service fallback triggered:', err.message);
    return 'GREEN';
  }
}

// POST /api/triage/submit
router.post('/submit', async (req, res) => {
  try {
    const { symptomsText, selectedSymptoms, totalScore, language } = req.body || {};

    let triageLevel = 'GREEN';

    // Calculate level based on input
    if (symptomsText && symptomsText.trim().length > 0) {
      triageLevel = await parseWithLocalIndicBERT(symptomsText, language);
    } else {
      const score = Number(totalScore) || 0;
      if (score >= 4) triageLevel = 'RED';
      else if (score >= 2) triageLevel = 'YELLOW';
    }

    const calculatedScore = Number(totalScore) || 0;

    // Try saving to database
    let triageRecord = null;
    try {
      triageRecord = new Triage({
        symptomsText: symptomsText || '',
        selectedSymptoms: Array.isArray(selectedSymptoms) ? selectedSymptoms : [],
        mewsScore: calculatedScore,
        triageLevel,
        language: language || 'en-IN'
      });
      await triageRecord.save();
    } catch (dbErr) {
      console.error('Database write error (returning fallback response):', dbErr.message);
    }

    // Always respond with success so UI renders the triage card
    return res.status(200).json({
      success: true,
      message: 'Triage assessment processed successfully',
      data: triageRecord || {
        symptomsText: symptomsText || '',
        selectedSymptoms: selectedSymptoms || [],
        mewsScore: calculatedScore,
        triageLevel,
        language: language || 'en-IN'
      }
    });
  } catch (error) {
    console.error('Server triage submission error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/triage/all
router.get('/all', async (req, res) => {
  try {
    const records = await Triage.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;