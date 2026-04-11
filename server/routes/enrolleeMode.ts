import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";
import { insertSemesterSchema, insertEnrollmentSchema } from "@shared/schema";

const router = Router();

router.post("/onboarding/complete", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    const { schoolName, academicYear, term, yearLevel, selectedSubjects } = req.body;

    const semester = await storage.createOrGetSemester({
      schoolName,
      academicYear,
      term,
    });

    for (const subj of selectedSubjects) {
      await storage.createEnrollment({
        userId,
        semesterId: semester.id,
        subjectId: subj.id,
        schoolCode: subj.schoolCode,
        units: subj.units || 3,
        active: true,
      });
    }

    const user = await storage.updateUserOnboarding(userId, {
      onboardingCompleted: true,
      schoolName,
      yearLevel,
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
});

router.get("/subjects", isAuthenticated, async (req: any, res) => {
  try {
    const subjects = await storage.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});

router.get("/enrollments", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    const enrollments = await storage.getUserEnrollments(userId);
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

router.post("/enrollments", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    const { semesterId, subjectId, schoolCode, units } = req.body;

    const enrollment = await storage.createEnrollment({
      userId,
      semesterId,
      subjectId,
      schoolCode,
      units: units || 3,
      active: true,
    });

    res.json(enrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ message: "Failed to create enrollment" });
  }
});

router.patch("/enrollments/:id/status", isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const enrollment = await storage.updateEnrollmentStatus(Number(id), active);
    res.json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    res.status(500).json({ message: "Failed to update enrollment status" });
  }
});

router.get("/active-subjects", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id || req.user?.claims?.sub;
    const subjectIds = await storage.getActiveEnrolledSubjectIds(userId);
    res.json(subjectIds);
  } catch (error) {
    console.error("Error fetching active subjects:", error);
    res.status(500).json({ message: "Failed to fetch active subjects" });
  }
});

export default router;
