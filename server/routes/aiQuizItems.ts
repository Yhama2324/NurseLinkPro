import { Router } from "express";
import { db } from "../db";
import { quizItems, subjectTopics } from "@shared/schema";
import { generateQuizItems, normalizeQuizItem } from "../aiQuizGenerator";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const { subject_code, n = 10, difficulty = "mixed" } = req.body || {};
    
    if (!subject_code) {
      return res.status(400).json({ error: "subject_code is required" });
    }

    const topics = await db
      .select({
        topicName: subjectTopics.topicName,
        tags: subjectTopics.tags,
      })
      .from(subjectTopics)
      .where(eq(subjectTopics.subjectCode, subject_code));

    if (topics.length === 0) {
      return res.status(404).json({ error: "No topics/tags found for subject_code" });
    }

    const allTags = topics.flatMap(t => t.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    const tagPool = uniqueTags.slice(0, 30);

    const aiItems = await generateQuizItems({
      subjectCode: subject_code,
      topicTags: tagPool,
      count: n,
      difficulty: difficulty as "easy" | "medium" | "hard" | "mixed",
    });

    let created = 0;
    for (const raw of aiItems) {
      const item = normalizeQuizItem(raw);
      if (!item) continue;

      const exists = await db
        .select({ id: quizItems.id })
        .from(quizItems)
        .where(
          and(
            eq(quizItems.subjectCode, subject_code),
            eq(quizItems.question, item.question)
          )
        )
        .limit(1);

      if (exists.length > 0) continue;

      await db.insert(quizItems).values({
        subjectCode: subject_code,
        topicName: null,
        question: item.question,
        choices: item.options,
        correctIndex: item.correct_index,
        difficulty: item.difficulty,
        tags: item.tags,
        rationale: item.rationale,
        sourceNote: "ai_gen_v1",
      });
      created++;
    }

    res.json({ ok: true, created });
  } catch (error: any) {
    console.error("Error generating quiz items:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/pull", async (req, res) => {
  try {
    const subject = String(req.query.subject_code || "");
    const n = Math.min(parseInt(String(req.query.n || "10"), 10), 100);
    
    if (!subject) {
      return res.status(400).json({ error: "subject_code required" });
    }

    const items = await db
      .select({
        id: quizItems.id,
        question: quizItems.question,
        options: quizItems.choices,
        difficulty: quizItems.difficulty,
      })
      .from(quizItems)
      .where(eq(quizItems.subjectCode, subject))
      .orderBy(sql`RANDOM()`)
      .limit(n);

    res.json({ items });
  } catch (error: any) {
    console.error("Error pulling quiz items:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    
    if (answers.length === 0) {
      return res.status(400).json({ error: "answers required" });
    }

    const ids = answers.map((a: any) => a.id);
    const items = await db
      .select({
        id: quizItems.id,
        correctIndex: quizItems.correctIndex,
        rationale: quizItems.rationale,
      })
      .from(quizItems)
      .where(sql`${quizItems.id} = ANY(${ids})`);

    const byId = new Map(items.map(item => [item.id, item]));
    let correct = 0;
    const detail = answers.map((a: any) => {
      const key = byId.get(a.id);
      const isCorrect = key ? key.correctIndex === a.choiceIndex : false;
      if (isCorrect) correct++;
      return { 
        id: a.id, 
        correct: isCorrect, 
        rationale: key?.rationale || null 
      };
    });

    res.json({ 
      total: answers.length, 
      correct, 
      detail 
    });
  } catch (error: any) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
