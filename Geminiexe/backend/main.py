import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("GEMINI_API_KEY")
print("API KEY IS:", api_key)   # 👈 ADD THIS LINE

client = genai.Client(api_key=api_key)


class TranslateRequest(BaseModel):
    text: str
    target: str
    domain: str = "General"


class SummaryRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"status": "Backend running 🚀"}


@app.post("/translate")
def translate(req: TranslateRequest):
    print("REQUEST GOT:", req.text)

    prompt = f"""
You are a professional real-time translator.

Translate this text into {req.target}.
Domain: {req.domain}

Text:
{req.text}

Return ONLY translated text.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        translation = response.candidates[0].content.parts[0].text

        return {"translation": translation}

    except Exception as e:
        return {"error": str(e)}


@app.post("/summary")
def summary(req: SummaryRequest):

    prompt = f"""
You are an AI meeting assistant.

Analyze this conversation:

{req.text}

Return:
- Executive Summary
- Key Decisions
- Action Items
- Risks
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {"summary": response.candidates[0].content.parts[0].text}

    except Exception as e:
        return {"error": str(e)}