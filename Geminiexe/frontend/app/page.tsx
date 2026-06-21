'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const [targetLanguage, setTargetLanguage] = useState('English');
  const [domain, setDomain] = useState('General');
  const [isListening, setIsListening] = useState(false);

  // ✅ FIXED SPEECH RECOGNITION (ROBUST VERSION)
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition NOT supported. Use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true; // IMPORTANT FIX

    setIsListening(true);

    recognition.start();

    recognition.onstart = () => {
      console.log('🎤 Listening started...');
    };

    recognition.onresult = (event: any) => {
      console.log('🟢 Speech event:', event);

      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      console.log('📝 Transcript:', transcript);

      setText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.log('❌ Speech error:', event.error);
      alert('Speech Error: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 Listening ended');
      setIsListening(false);
    };
  };

  // 🔊 SPEAK TRANSLATION
  const speakTranslation = () => {
    if (!translation) return;

    const utterance = new SpeechSynthesisUtterance(translation);

    switch (targetLanguage) {
      case 'Tamil':
        utterance.lang = 'ta-IN';
        break;
      case 'Hindi':
        utterance.lang = 'hi-IN';
        break;
      case 'German':
        utterance.lang = 'de-DE';
        break;
      case 'French':
        utterance.lang = 'fr-FR';
        break;
      case 'Spanish':
        utterance.lang = 'es-ES';
        break;
      default:
        utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  };

  // 🌍 TRANSLATE
  const translateText = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          target: targetLanguage,
          domain,
        }),
      });

      const data = await response.json();

      setTranslation(data.translation || 'No translation returned');
    } catch (error) {
      console.error(error);
      alert('Translation failed');
    } finally {
      setLoading(false);
    }
  };

  // 🧠 SUMMARY
  const generateSummary = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://127.0.0.1:8000/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      setSummary(data.summary || 'No summary returned');
    } catch (error) {
      console.error(error);
      alert('Summary failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            LiveBridge AI
          </h1>
          <p className="mt-3 text-slate-400 text-lg">
            Voice Translation + Meeting Intelligence (Gemini Powered)
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">Translation Engine</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">

              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-slate-800 p-2 rounded"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>German</option>
                <option>French</option>
                <option>Spanish</option>
              </select>

              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-slate-800 p-2 rounded"
              >
                <option>General</option>
                <option>Medical</option>
                <option>Legal</option>
                <option>Software Engineering</option>
                <option>Business</option>
              </select>

            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-56 bg-slate-800 p-3 rounded"
              placeholder="Speak or type here..."
            />

            <div className="grid grid-cols-3 gap-3 mt-4">

              <button
                onClick={startListening}
                className="bg-purple-600 py-2 rounded"
              >
                {isListening ? '🎤 Listening...' : '🎤 Speak'}
              </button>

              <button
                onClick={translateText}
                className="bg-blue-600 py-2 rounded"
              >
                Translate
              </button>

              <button
                onClick={speakTranslation}
                className="bg-cyan-600 py-2 rounded"
              >
                🔊 Speak
              </button>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">Output</h2>

            <div className="bg-slate-800 p-4 rounded min-h-50">
              {translation || 'Translation will appear here'}
            </div>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">AI Meeting Intelligence</h2>

            <button
              onClick={generateSummary}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Generate Insights
            </button>
          </div>

          <div className="mt-4 bg-slate-800 p-4 rounded min-h-50 whitespace-pre-wrap">
            {summary || 'Summary will appear here'}
          </div>

        </div>

      </div>
    </main>
  );
}