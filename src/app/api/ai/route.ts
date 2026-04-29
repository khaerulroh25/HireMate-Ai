import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, answer } = body;

    const prompt = `
        Kamu adalah AI interview coach.
        Posisi: ${role}

        Jawaban kandidat:
        "${answer}"

        - Skor (1-10)
        - Kelebihan
        - Kekurangan
        - Contoh jawaban yang lebih baik
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

    console.log("AI RESPONSE:", data);

    if (!data.choices) {
      return NextResponse.json({
        error: "AI Error",
        detail: data,
      });
    }

    return NextResponse.json({
      result: data.choices[0].message.content,
    });
  } catch (err) {
    return NextResponse.json({
      error: "Server Error",
      detail: String(err),
    });
  }
}
