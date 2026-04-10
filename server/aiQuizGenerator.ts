import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface QuizItemResponse {
  question: string;
  options: string[];
  correct_index: number;
  difficulty: "easy" | "medium" | "hard";
  rationale: string;
  tags: string[];
}

interface GenerateQuizItemsParams {
  subjectCode: string;
  topicTags: string[];
  count: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
}

export async function generateQuizItems(params: GenerateQuizItemsParams): Promise<QuizItemResponse[]> {
  const { subjectCode, topicTags, count, difficulty = "mixed" } = params;

  const difficultyMix =
    difficulty === "easy" ? { easy: 1, medium: 0, hard: 0 } :
    difficulty === "hard" ? { easy: 0, medium: 0, hard: 1 } :
    { easy: 0.4, medium: 0.4, hard: 0.2 };

  const prompt = `
Create ${count} multiple-choice nursing questions for subject "${subjectCode}" ONLY using these topic tags:
${JSON.stringify(topicTags)}.

Blueprint:
- Difficulty mix: ${JSON.stringify(difficultyMix)} (label each item: "easy" | "medium" | "hard")
- 4 options exactly per item (A–D). One correct answer (use 0..3 index).
- PNLE/NCLEX style; clinical reasoning; clear stems; no trick questions.
- Keep context Filipino-friendly where appropriate.
- Provide a brief rationale.

Return STRICT JSON ONLY in this shape:
{
  "items": [
    {
      "question": "text",
      "options": ["A","B","C","D"],
      "correct_index": 0,
      "difficulty": "easy|medium|hard",
      "rationale": "why correct & why others are not",
      "tags": ["one or more from provided list"]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are a nursing board exam item writer." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content || "{}";
  const response = JSON.parse(content);

  if (!response?.items || !Array.isArray(response.items)) {
    throw new Error("AI did not return valid items array");
  }

  return response.items;
}

export function normalizeQuizItem(item: any): QuizItemResponse | null {
  if (!item || typeof item !== "object") return null;
  
  const { question, options, correct_index, difficulty, rationale, tags } = item;

  if (!question || !Array.isArray(options) || options.length !== 4) return null;
  if (typeof correct_index !== "number" || correct_index < 0 || correct_index > 3) return null;

  return {
    question: String(question).trim(),
    options,
    correct_index,
    difficulty: ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium",
    rationale: rationale ? String(rationale) : "",
    tags: Array.isArray(tags) ? tags.map(t => String(t).toLowerCase()) : [],
  };
}
