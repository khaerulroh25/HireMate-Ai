"use client";

import { Federant } from "next/font/google";
import { useState } from "react";
import { start } from "repl";

export default function Home() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [started, setStarted] = useState(false);

  const startInterview = async () => {
    const res = await fetch("/api/questions", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setStarted(true);
  };

  const submitAnswer = async () => {
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        role,
        answer,
      }),
    });
    const data = await res.json();
    setFeedback(data.result);
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback("");
    setCurrent((prev) => prev + 1);
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">HireMate AI</h1>

      {!started && (
        <>
          <input
            className="w-full border p-2"
            placeholder="Masukan Role pekerjaan (Contoh Backend Developer)"
            onChange={(e) => setRole(e.target.value)}
          />

          <button
            onClick={startInterview}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Mulai Interview
          </button>
        </>
      )}

      {started && questions.length > 0 && (
        <>
          <h2 className="font-semibold">Pertanyaan {current + 1}:</h2>
          <p>{questions[current]}</p>
          <textarea
            className="w-full border p-2"
            placeholder="Your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={submitAnswer}
            className="bg-green-500 text-white px-4 py-2"
          >
            Submit Jawaban
          </button>

          {feedback && (
            <div className="bg-gray-100 p-4 whitespace-pre-wrap">
              {feedback}
            </div>
          )}

          {feedback && current < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="bg-purple-500 text-white px-4 py-2"
            >
              Pertanyaan selanjutnya
            </button>
          )}

          {current === questions.length - 1 && feedback && (
            <p className="font-bold tect-green-600">Interview Selesai</p>
          )}
        </>
      )}
    </main>
  );
}
