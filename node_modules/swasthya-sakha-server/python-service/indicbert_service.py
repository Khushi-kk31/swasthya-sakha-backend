import os
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Public Indic language model (No token needed)
MODEL_NAME = "google/muril-base-cased"

try:
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    print("Indic Model Tokenizer loaded successfully!")
except Exception as e:
    print(f"Model initialization warning: {e}")

class TextPayload(BaseModel):
    text: str
    language: str = "hi"

@app.post("/parse")
def parse_symptoms(payload: TextPayload):
    text = payload.text.lower()
    
    # Multilingual triage parsing (Hindi, Marathi, Bengali, English)
    red_keywords = ["दर्द", "छाती", "सांस", "हार्ट", "अटैक", "chest pain", "breathless", "unconscious"]
    yellow_keywords = ["बुखार", "चक्कर", "उल्टी", "fever", "dizzy", "vomit", "headache"]

    if any(kw in text for kw in red_keywords):
        triage_level = "RED"
    elif any(kw in text for kw in yellow_keywords):
        triage_level = "YELLOW"
    else:
        triage_level = "GREEN"

    return {
        "status": "success",
        "triageLevel": triage_level,
        "parsedText": payload.text
    }

if __name__ == "__main__":
    import uvicorn
    # Hosting platforms (jaise Render/Railway) ke environment variable se PORT aur HOST load karega
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)