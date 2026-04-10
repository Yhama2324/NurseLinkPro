import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "fundamentals", label: "NP I - Fundamentals", color: "bg-blue-500" },
  { id: "maternal", label: "NP II - Maternal", color: "bg-pink-500" },
  { id: "medsurg", label: "NP III/IV - MedSurg", color: "bg-green-500" },
  { id: "psychiatric", label: "NP V - Psychiatric", color: "bg-purple-500" },
  { id: "pharmacology", label: "Pharmacology", color: "bg-yellow-500" },
  { id: "community", label: "Community Health", color: "bg-red-500" },
];

interface Question {
  question: string;
  choices: Record<string, string>;
  correct: string;
  rationale: string;
}

export default function AIQuizGenerator() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("fundamentals");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { setError("Enter a topic!"); return; }
    setLoading(true); setError(""); setQuestions([]); setAnswers({}); setSubmitted(false);
    const cat = CATEGORIES.find(c => c.id === category)?.label || category;
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category: cat, difficulty, count }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || "Failed to generate. Try again.");
    } finally { setLoading(false); }
  };

  const score = questions.filter((q, i) => answers[i] === q.correct).length;

  return (
    <Card className="p-4 mb-4 border-2 border-dashed border-blue-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-sm">AI Quiz Generator</span>
          <Badge variant="secondary" className="text-xs">PNLE</Badge>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="Topic (e.g. Burns, Diabetes, Schizophrenia...)"
            className="w-full p-2 rounded-lg border text-sm focus:outline-none focus:border-blue-400"
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  category === cat.id
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Difficulty</p>
              <div className="flex gap-1">
                {["easy","medium","hard"].map(d => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`flex-1 text-xs py-1 rounded-lg border capitalize ${difficulty === d ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-500"}`}
                  >{d}</button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Questions</p>
              <div className="flex gap-1">
                {[3,5,10].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    className={`flex-1 text-xs py-1 rounded-lg border font-bold ${count === n ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-500"}`}
                  >{n}</button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <Button onClick={generate} disabled={loading} className="w-full" size="sm">
            {loading ? "⏳ Generating..." : "✨ Generate Questions"}
          </Button>

          {questions.length > 0 && (
            <div className="space-y-4 mt-2">
              {questions.map((q, qi) => (
                <div key={qi} className="p-3 rounded-xl bg-gray-50 border">
                  <p className="text-sm font-medium mb-2">{qi + 1}. {q.question}</p>
                  <div className="space-y-1">
                    {Object.entries(q.choices).map(([key, val]) => {
                      const isSel = answers[qi] === key;
                      const isCorrect = q.correct === key;
                      let cls = "border-gray-200 text-gray-700";
                      if (submitted) {
                        if (isCorrect) cls = "border-green-400 bg-green-50 text-green-700";
                        else if (isSel) cls = "border-red-400 bg-red-50 text-red-700";
                      } else if (isSel) cls = "border-blue-400 bg-blue-50 text-blue-700";
                      return (
                        <button key={key} onClick={() => !submitted && setAnswers(p => ({...p, [qi]: key}))}
                          className={`w-full text-left text-xs p-2 rounded-lg border flex gap-2 ${cls}`}
                        >
                          <span className="font-bold uppercase">{key}.</span>
                          <span>{val}</span>
                          {submitted && isCorrect && <span className="ml-auto">✓</span>}
                          {submitted && isSel && !isCorrect && <span className="ml-auto">✗</span>}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-700 border border-green-200">
                      <strong>Rationale:</strong> {q.rationale}
                    </div>
                  )}
                </div>
              ))}

              {!submitted ? (
                <Button onClick={() => {
                  if (Object.keys(answers).length < questions.length) { setError("Answer all questions!"); return; }
                  setError(""); setSubmitted(true);
                }} className="w-full" size="sm" variant="outline">
                  Submit Answers
                </Button>
              ) : (
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl mb-1">{score === questions.length ? "🎉" : score >= questions.length * 0.7 ? "👏" : "📚"}</div>
                  <div className="font-bold text-blue-600">{score}/{questions.length} correct</div>
                  <button onClick={() => { setQuestions([]); setTopic(""); setAnswers({}); setSubmitted(false); }}
                    className="mt-2 text-xs text-blue-500 underline">Try another topic</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
