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
  const [loading, setLoading] = useState(false);
  const [loadingjawaban, setLoadingJawaban] = useState(false);
  const [allFeedback, setAllFeedback] = useState<string[]>([]);

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Role tidak boleh kosong!");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setStarted(true);
    setLoading(false);
  };

  const submitAnswer = async () => {
    setLoadingJawaban(true);
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        role,
        answer,
      }),
    });
    const data = await res.json();
    setFeedback(data.result);
    setAllFeedback((prev) => [...prev, data.result]);
    setLoadingJawaban(false);
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback("");
    setCurrent((prev) => prev + 1);
  };

  const calculateScore = () => {
    let total = 0;
    allFeedback.forEach((fb) => {
      const match = fb.match(/(\d+)\/10/);
      if (match) {
        total += parseInt(match[1]);
      }
    });
    return Math.round(total / allFeedback.length || 0);
  };

  return (
    <main className="p-6 min-h-screen bg-blue-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          HireMate AI
        </h1>

        {!started && (
          <>
            <input
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukan Role pekerjaan (Contoh Backend Developer)"
              onChange={(e) => setRole(e.target.value)}
            />

            <button
              onClick={startInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Mulai Interview
            </button>
          </>
        )}

        {loading && (
          <p className="text-blue-500">Sedang Generate pertanyaan.....</p>
        )}

        {started && questions.length > 0 && (
          <div className="space-y-6">
            <div className="text-sm text-gray-500">
              Pertanyaan {current + 1} dari {questions.length}
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 border">
              <h2 className="font-semibold text-lg mb-2 text-gray-800">
                Pertanyaan {current + 1}
              </h2>
              <p className="text-gray-700">{questions[current]}</p>
            </div>

            <textarea
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tulis jawaban kamu di sini..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              onClick={submitAnswer}
              className="w-full bg-blue-700 hover:bg-blue-500 text-white py-2 rounded-lg transition"
            >
              Submit Jawaban
            </button>

            {loadingjawaban && (
              <p className="text-blue-500">Sedang menilai jawaban.....</p>
            )}

            {feedback && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg whitespace-pre-wrap">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Feedback AI
                </h3>
                <p className="text-gray-700">{feedback}</p>
              </div>
            )}

            {feedback && current < questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Pertanyaan selanjutnya
              </button>
            )}

            {current === questions.length - 1 && feedback && (
              <div className="text-center">
                <p className="font-bold text-green-600 text-lg">
                  Interview Selesai!
                </p>

                <p className="text-gray-700">Skor Akhir Kamu:</p>
                <p className="text-3xl font-bold text-green-600">
                  {calculateScore()}/10
                </p>
                <p className="text-sm text-gray-500">
                  Terus latihan untuk meningkatkan performa kamu !!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
