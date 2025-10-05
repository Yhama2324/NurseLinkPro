import { Router } from "express";
import { WEEKLY_CHALLENGE } from "../../shared/config/challenge";
import { startOfWeek } from "../utils/week";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";

const router = Router();

function calcScore(correct: number, events: { correct: boolean; latencyMs: number | null }[]) {
  const base = correct * WEEKLY_CHALLENGE.points.correct;
  const speedBonus = Math.min(
    WEEKLY_CHALLENGE.points.speedBonusMax,
    Math.round(events.filter(e => e.correct && (e.latencyMs ?? 9999) < 15000).length / 10)
  );
  return base + speedBonus;
}

router.get("/me", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const weekStart = startOfWeek(new Date(), WEEKLY_CHALLENGE.weekStartsOn);
    
    const progress = await storage.getWeeklyChallengeProgress(userId, weekStart);
    
    res.json({
      goal: WEEKLY_CHALLENGE.weeklyGoal,
      answered: progress?.answered ?? 0,
      correct: progress?.correct ?? 0,
      streakWeeks: progress?.streakWeeks ?? 0,
    });
  } catch (error) {
    console.error("Error fetching weekly challenge progress:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
});

router.post("/answer", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { questionId, correct, latencyMs } = req.body;
    const weekStart = startOfWeek(new Date(), WEEKLY_CHALLENGE.weekStartsOn);

    await storage.recordWeeklyChallengeEvent({
      userId,
      weekStart,
      questionId,
      correct: !!correct,
      latencyMs: latencyMs ?? null,
    });

    await storage.upsertWeeklyChallengeProgress({
      userId,
      weekStart,
      answered: 1,
      correct: correct ? 1 : 0,
      streakWeeks: 0,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error recording challenge answer:", error);
    res.status(500).json({ message: "Failed to record answer" });
  }
});

router.post("/finalize", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const weekStart = startOfWeek(new Date(), WEEKLY_CHALLENGE.weekStartsOn);

    const progress = await storage.getWeeklyChallengeProgress(userId, weekStart);
    if (!progress) {
      return res.status(400).json({ error: "No progress found" });
    }

    const events = await storage.getWeeklyChallengeEvents(userId, weekStart);
    const score = calcScore(progress.correct, events.map(e => ({ correct: e.correct, latencyMs: e.latencyMs })));

    let streakWeeks = progress.streakWeeks;
    if (progress.answered >= WEEKLY_CHALLENGE.weeklyGoal) {
      const prevWeek = new Date(weekStart);
      prevWeek.setDate(prevWeek.getDate() - 7);
      const prevProgress = await storage.getWeeklyChallengeProgress(userId, prevWeek);
      const prevStreak = prevProgress?.streakWeeks ?? 0;
      streakWeeks = prevStreak + 1;

      await storage.upsertWeeklyChallengeProgress({
        userId,
        weekStart,
        answered: progress.answered,
        correct: progress.correct,
        streakWeeks,
      });
    }

    await storage.upsertWeeklyLeaderboard({
      weekStart,
      userId,
      score,
    });

    res.json({
      completed: progress.answered >= WEEKLY_CHALLENGE.weeklyGoal,
      score,
      streakWeeks,
    });
  } catch (error) {
    console.error("Error finalizing week:", error);
    res.status(500).json({ message: "Failed to finalize week" });
  }
});

export default router;
