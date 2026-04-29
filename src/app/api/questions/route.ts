import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role } = body;

    const prompt = `Buat 4 pertanyaan interview untuk posisi ${role}.

    PENTING:
    - Gunakan Bahasa Indonesia
    - Jangan tambahkan penjelasan apapun
    - Format HARUS berupa JSON seperti ini:

    ["Pertanyaan 1", "Pertanyaan 2", "Pertanyaan 3", "Pertanyaan 4]
    `;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "HireMate AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    let questions: string[] = [];

    try {
      questions = JSON.parse(text);
    } catch (e) {
      console.log("JSON parse failed");

      questions = [
        "Ceritakan pengalaman Anda dalam pengembangan backend.",
        "Bagaimana cara Anda mendesain API yang scalable?",
        "Apa tantangan terbesar yang pernah Anda hadapi?",
      ];
    }

    return NextResponse.json({ questions });
  } catch (err) {
    return NextResponse.json({
      error: "Failed to generate questions",
      detail: String(err),
    });
  }
}
