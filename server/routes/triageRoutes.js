import express from 'express';
import Triage from '../models/Triage.js';

const router = express.Router();

// Fallback to local or cloud IndicBERT microservice
const INDICBERT_URL =
  process.env.PYTHON_SERVICE_URL ||
  process.env.INDICBERT_URL ||
  'https://indicbert-service.onrender.com';

// Helper function to send text to Python IndicBERT service with a safety timeout
async function parseWithLocalIndicBERT(text, language) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for cold start

    const res = await fetch(`${INDICBERT_URL}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, language }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Service responded with status ${res.status}`);
    }

    const data = await res.json();
    return data.triageLevel || 'GREEN';
  } catch (err) {
    console.error('IndicBERT service unreachable or timed out:', err.message);
    return 'GREEN'; // Safe fallback
  }
}

// POST /api/triage/submit
router.post('/submit', async (req, res) => {
  try {
    const { symptomsText, selectedSymptoms, totalScore, language } = req.body || {};

    let triageLevel = 'GREEN';

    // 1. If text/voice input is present, prioritize IndicBERT parsing
    if (symptomsText && symptomsText.trim().length > 0) {
      triageLevel = await parseWithLocalIndicBERT(symptomsText, language);
    } 
    // 2. If no text input, fallback to icon selection MEWS score
    else {
      const score = Number(totalScore) || 0;
      if (score >= 4) triageLevel = 'RED';
      else if (score >= 2) triageLevel = 'YELLOW';
    }

    const triageRecord = new Triage({
      symptomsText: symptomsText || '',
      selectedSymptoms: Array.isArray(selectedSymptoms) ? selectedSymptoms : [],
      mewsScore: Number(totalScore) || 0,
      triageLevel,
      language: language || 'en-IN'
    });

    await triageRecord.save();

    return res.status(201).json({
      success: true,
      message: 'Triage assessment saved successfully',
      data: triageRecord
    });
  } catch (error) {
    console.error('Triage submit error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/triage/all
router.get('/all', async (req, res) => {
  try {
    const records = await Triage.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: records });
  } catch (error) {
    console.error('Fetch triage records error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;