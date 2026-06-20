# LiveBridge AI

LiveBridge AI is a real-time voice translation and AI-assisted communication system built using FastAPI and Google Gemini. It enables speech or text-based multilingual translation and generates structured meeting intelligence such as summaries, decisions, action items, and risks.

---

## Overview

LiveBridge AI is designed to reduce language barriers in real-time communication and improve productivity in meetings. It processes user input, translates content into the target language, and provides AI-generated insights from conversations.

---

## Features

### Speech Input
Supports browser-based speech-to-text input using the Web Speech API.

### Real-Time Translation
Uses Google Gemini 2.5 Flash to translate text into multiple languages with domain awareness (General, Technical, Medical, Legal, Business).

### Text-to-Speech Output
Converts translated text into natural speech using the browser SpeechSynthesis API.

### AI Meeting Intelligence
Automatically generates structured outputs from conversations, including:
- Executive Summary
- Key Decisions
- Action Items
- Risks and Concerns

### Domain-Aware Processing
Improves translation and summarization quality based on selected context domain.

---

## Tech Stack

Frontend:
- Next.js (React)
- Tailwind CSS
- Web Speech API (Speech Recognition + Speech Synthesis)

Backend:
- FastAPI (Python)
- Pydantic
- Uvicorn

AI Model:
- Google Gemini 2.5 Flash API

---

## System Architecture

User Speech Input
→ Speech-to-Text (Browser)
→ Text Request to FastAPI Backend
→ Gemini 2.5 Flash Processing
→ Translation / Summarization Output
→ Response to Frontend
→ Text Display + Speech Output
