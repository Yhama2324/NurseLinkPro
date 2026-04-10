import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import OpenAI from "openai";
import Stripe from "stripe";
import { insertPostSchema, insertCommentSchema, insertClanSchema, insertPartySchema, insertReviewCenterSchema, insertJobSchema, insertAdSchema } from "@shared/schema";

// OpenAI optional

// Stripe optional

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Weekly Challenge routes
  const weeklyChallengeRouter = (await import('./routes/weeklyChallenge')).default;
  app.use('/api/weekly-challenge', weeklyChallengeRouter);

  // Enrollee Mode routes
  const enrolleeModeRouter = (await import('./routes/enrolleeMode')).default;
  app.use('/api/enrollee', enrolleeModeRouter);

  // AI Quiz Items routes
  const aiQuizItemsRouter = (await import('./routes/aiQuizItems')).default;
  app.use('/api/ai-quiz', aiQuizItemsRouter);

  // Object storage routes - Referenced from blueprint:javascript_object_storage
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/post-images", isAuthenticated, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user.claims.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting post image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Posts routes
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/trending-hashtags', async (req, res) => {
    try {
      // Get all posts and extract hashtags
      const posts = await storage.getAllPosts();
      const hashtagCounts: Record<string, number> = {};
      
      posts.forEach(post => {
        if (post.hashtags) {
          post.hashtags.forEach(tag => {
            hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
          });
        }
      });
      
      // Sort by count and return top 5
      const trending = Object.entries(hashtagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag);
      
      res.json(trending.length > 0 ? trending : ["StudyRN", "BoardJourney", "NurseGoals", "MedSurg", "NCLEX2024"]);
    } catch (error) {
      console.error("Error fetching trending hashtags:", error);
      res.json(["StudyRN", "BoardJourney", "NurseGoals", "MedSurg", "NCLEX2024"]);
    }
  });

  app.get('/api/posts/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getPostsByUser(req.params.userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({ ...req.body, userId });
      const post = await storage.createPost(postData);
      
      // Award XP for creating a post
      await storage.updateUserXP(userId, 5);
      
      res.json(post);
    } catch (error: any) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: error.message || "Failed to create post" });
    }
  });

  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.likePost(postId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({ ...req.body, userId, postId });
      const comment = await storage.addComment(commentData);
      res.json(comment);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      res.status(400).json({ message: error.message || "Failed to add comment" });
    }
  });

  // Quiz routes
  app.get('/api/quizzes', async (req, res) => {
    try {
      const quizzes = await storage.getAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get('/api/quiz-generation-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tierLimits = {
        free: { questionCount: 3, cooldownHours: 24, earnXP: false },
        pro: { questionCount: 30, cooldownHours: 4, earnXP: true },
        elite: { questionCount: 50, cooldownHours: user.customQuizIntervalHours || 1, earnXP: true }
      };

      const tier = user.subscriptionTier as 'free' | 'pro' | 'elite';
      const limits = tierLimits[tier] || tierLimits.free;
      
      let canGenerate = true;
      let nextAvailableTime = null;
      let remainingHours = 0;

      if (user.lastQuizGenerationTime) {
        const timeSinceLastGeneration = Date.now() - new Date(user.lastQuizGenerationTime).getTime();
        const cooldownMs = limits.cooldownHours * 60 * 60 * 1000;
        
        if (timeSinceLastGeneration < cooldownMs) {
          canGenerate = false;
          remainingHours = Math.ceil((cooldownMs - timeSinceLastGeneration) / (60 * 60 * 1000));
          nextAvailableTime = new Date(new Date(user.lastQuizGenerationTime).getTime() + cooldownMs).toISOString();
        }
      }

      res.json({
        canGenerate,
        remainingHours,
        nextAvailableTime,
        tier: user.subscriptionTier,
        limits: {
          questionCount: limits.questionCount,
          cooldownHours: limits.cooldownHours,
          earnXP: limits.earnXP
        }
      });
    } catch (error) {
      console.error("Error checking quiz generation status:", error);
      res.status(500).json({ message: "Failed to check status" });
    }
  });

  app.get('/api/quizzes/:id/questions', async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const questions = await storage.getQuestionsByQuiz(quizId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post('/api/quizzes/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, category, difficulty } = req.body;
      const userId = req.user.claims.sub;

      // Get user to check subscription tier and last generation time
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Determine quiz limits based on subscription tier
      const tierLimits = {
        free: { questionCount: 3, cooldownHours: 24, earnXP: false },
        pro: { questionCount: 30, cooldownHours: 4, earnXP: true },
        elite: { questionCount: 50, cooldownHours: user.customQuizIntervalHours || 1, earnXP: true }
      };

      const tier = user.subscriptionTier as 'free' | 'pro' | 'elite';
      const limits = tierLimits[tier] || tierLimits.free;

      // Check if user can generate a new quiz (cooldown check)
      if (user.lastQuizGenerationTime) {
        const timeSinceLastGeneration = Date.now() - new Date(user.lastQuizGenerationTime).getTime();
        const cooldownMs = limits.cooldownHours * 60 * 60 * 1000;
        
        if (timeSinceLastGeneration < cooldownMs) {
          const remainingMs = cooldownMs - timeSinceLastGeneration;
          const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
          return res.status(429).json({ 
            message: `You can generate a new quiz in ${remainingHours} hour(s). Upgrade your plan for faster quiz generation!`,
            nextAvailableTime: new Date(new Date(user.lastQuizGenerationTime).getTime() + cooldownMs).toISOString()
          });
        }
      }

      const questionCount = limits.questionCount;

      // Get user's enrolled subjects if onboarding is completed
      let topicContext = topic;
      if (user.onboardingCompleted) {
        const enrollments = await storage.getUserEnrollments(userId);
        const activeEnrollments = enrollments.filter(e => e.active);
        
        if (activeEnrollments.length > 0) {
          // Get canonical codes from enrolled subjects
          const canonicalCodes = activeEnrollments
            .map(e => e.subject?.canonicalCode)
            .filter(Boolean) as string[];
          
          // Get curriculum subjects by codes
          const curriculumSubjects = await storage.getCurriculumSubjectsByCodes(canonicalCodes);
          
          // Get topics for each curriculum subject
          const allTopics = [];
          for (const subject of curriculumSubjects) {
            const topics = await storage.getCurriculumTopicsBySubject(subject.id);
            allTopics.push(...topics.map(t => `${subject.name}: ${t.name}`));
          }
          
          if (allTopics.length > 0) {
            topicContext = `${topic}. Focus on topics from the student's enrolled subjects: ${allTopics.slice(0, 10).join(', ')}`;
          }
        }
      }

      // Generate quiz using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert nursing educator creating quiz questions for Filipino nursing students preparing for ${category} exams. Generate high-quality multiple choice questions with detailed rationales.`
          },
          {
            role: "user",
            content: `Create ${questionCount} multiple choice questions about ${topicContext} at ${difficulty} difficulty level. Return a JSON array with this format:
            [{"questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "...", "rationale": "..."}]`
          }
        ],
        response_format: { type: "json_object" }
      });

      const response = JSON.parse(completion.choices[0].message.content || "{}");
      const questionsData = response.questions || [];

      // Create quiz
      const quiz = await storage.createQuiz({
        title: `${topic} - ${category}`,
        topic,
        category,
        difficulty: difficulty || "medium",
        createdById: userId
      });

      // Create questions
      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i];
        await storage.createQuestion({
          quizId: quiz.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          rationale: q.rationale,
          orderIndex: i
        });
      }

      // Update last quiz generation time
      await storage.updateUserQuizGenerationTime(userId);

      res.json({ 
        ...quiz, 
        canEarnXP: limits.earnXP,
        questionCount: questionsData.length 
      });
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: error.message || "Failed to generate quiz" });
    }
  });

  app.post('/api/quizzes/:id/attempt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quizId = parseInt(req.params.id);
      const { score, correctAnswers, totalQuestions } = req.body;
      
      // Get user to check subscription tier
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Free tier users don't earn XP
      const canEarnXP = user.subscriptionTier !== 'free';
      const xpEarned = canEarnXP ? correctAnswers * 10 : 0;
      
      const attempt = await storage.saveQuizAttempt({
        userId,
        quizId,
        score,
        correctAnswers,
        totalQuestions,
        xpEarned
      });

      // Update user XP only if they can earn it
      if (canEarnXP) {
        await storage.updateUserXP(userId, xpEarned);
      }

      res.json({ ...attempt, canEarnXP });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      res.status(500).json({ message: "Failed to save quiz attempt" });
    }
  });

  // Daily Challenge
  app.get('/api/daily-challenge', async (req, res) => {
    try {
      const challenge = await storage.getDailyChallenge();
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching daily challenge:", error);
      res.status(500).json({ message: "Failed to fetch daily challenge" });
    }
  });

  // Clans routes
  app.get('/api/clans', async (req, res) => {
    try {
      const clans = await storage.getAllClans();
      res.json(clans);
    } catch (error) {
      console.error("Error fetching clans:", error);
      res.status(500).json({ message: "Failed to fetch clans" });
    }
  });

  app.post('/api/clans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clanData = insertClanSchema.parse({ ...req.body, creatorId: userId });
      const clan = await storage.createClan(clanData);
      res.json(clan);
    } catch (error: any) {
      console.error("Error creating clan:", error);
      res.status(400).json({ message: error.message || "Failed to create clan" });
    }
  });

  app.post('/api/clans/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clanId = parseInt(req.params.id);
      await storage.joinClan(clanId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error joining clan:", error);
      res.status(500).json({ message: "Failed to join clan" });
    }
  });

  // Parties routes
  app.get('/api/parties', async (req, res) => {
    try {
      const parties = await storage.getAllParties();
      res.json(parties);
    } catch (error) {
      console.error("Error fetching parties:", error);
      res.status(500).json({ message: "Failed to fetch parties" });
    }
  });

  app.post('/api/parties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partyData = insertPartySchema.parse({ ...req.body, creatorId: userId });
      const party = await storage.createParty(partyData);
      res.json(party);
    } catch (error: any) {
      console.error("Error creating party:", error);
      res.status(400).json({ message: error.message || "Failed to create party" });
    }
  });

  // Badges
  app.get('/api/badges/:userId', isAuthenticated, async (req, res) => {
    try {
      const badges = await storage.getUserBadges(req.params.userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Leaderboard
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const quizId = req.query.quizId ? parseInt(req.query.quizId as string) : undefined;
      const leaderboard = await storage.getLeaderboard(quizId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Review Centers
  app.get('/api/review-centers', async (req, res) => {
    try {
      const centers = await storage.getAllReviewCenters();
      res.json(centers);
    } catch (error) {
      console.error("Error fetching review centers:", error);
      res.status(500).json({ message: "Failed to fetch review centers" });
    }
  });

  app.post('/api/review-centers', isAuthenticated, async (req, res) => {
    try {
      const centerData = insertReviewCenterSchema.parse(req.body);
      const center = await storage.createReviewCenter(centerData);
      res.json(center);
    } catch (error: any) {
      console.error("Error creating review center:", error);
      res.status(400).json({ message: error.message || "Failed to create review center" });
    }
  });

  // Jobs
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error: any) {
      console.error("Error creating job:", error);
      res.status(400).json({ message: error.message || "Failed to create job" });
    }
  });

  // Advertisements
  app.get('/api/advertisements', async (req, res) => {
    try {
      const ads = await storage.getAllAds();
      res.json(ads);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post('/api/advertisements', isAuthenticated, async (req, res) => {
    try {
      const adData = insertAdSchema.parse(req.body);
      const ad = await storage.createAd(adData);
      res.json(ad);
    } catch (error: any) {
      console.error("Error creating advertisement:", error);
      res.status(400).json({ message: error.message || "Failed to create advertisement" });
    }
  });

  // AI Copilot routes
  app.get('/api/ai/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getAiConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/ai/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversation = await storage.createAiConversation({
        userId,
        title: req.body.title || "New Conversation",
      });
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get('/api/ai/conversations/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getAiConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { conversationId, message } = req.body;

      // Save user message
      await storage.createAiMessage({
        conversationId,
        role: 'user',
        content: message,
      });

      // Get conversation history
      const messages = await storage.getAiConversationMessages(conversationId);
      
      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are NurseMind, an AI study assistant for Filipino nursing students. Provide clear explanations, personalized study advice, and help with NCLEX/PNLE preparation. Be encouraging and supportive."
          },
          ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
        ],
      });

      const aiResponse = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

      // Save AI response
      const aiMessage = await storage.createAiMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse,
      });

      res.json(aiMessage);
    } catch (error: any) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.post('/api/ai/study-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { topic, duration, level } = req.body;

      // Generate study plan with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert nursing educator. Create a detailed study plan in JSON format with topics, daily goals, and recommended resources for Filipino nursing students."
          },
          {
            role: "user",
            content: `Create a ${duration}-day study plan for ${topic} at ${level} level. Include specific topics, daily goals, and study tips. Return as JSON with structure: { topics: [{ day: number, topic: string, goals: string[], resources: string[] }] }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const planData = JSON.parse(completion.choices[0].message.content || '{"topics":[]}');

      const studyPlan = await storage.createStudyPlan({
        userId,
        title: `${topic} Study Plan`,
        description: `${duration}-day plan for ${level} level`,
        topics: planData.topics,
        duration,
      });

      res.json(studyPlan);
    } catch (error: any) {
      console.error("Error creating study plan:", error);
      res.status(500).json({ message: "Failed to create study plan" });
    }
  });

  app.get('/api/ai/study-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plans = await storage.getUserStudyPlans(userId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching study plans:", error);
      res.status(500).json({ message: "Failed to fetch study plans" });
    }
  });

  // Curriculum routes - Secure access to BSN curriculum database
  app.get('/api/curriculum/subjects', isAuthenticated, async (req, res) => {
    try {
      const subjects = await storage.getAllCurriculumSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching curriculum subjects:", error);
      res.status(500).json({ message: "Failed to fetch curriculum subjects" });
    }
  });

  app.get('/api/curriculum/subjects/year/:year', isAuthenticated, async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const subjects = await storage.getCurriculumSubjectsByYear(year);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching curriculum subjects by year:", error);
      res.status(500).json({ message: "Failed to fetch curriculum subjects" });
    }
  });

  app.get('/api/curriculum/subjects/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subject = await storage.getCurriculumSubjectById(id);
      
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const topics = await storage.getCurriculumTopicsBySubject(id);
      const topicsWithDetails = await Promise.all(
        topics.map(async (topic) => {
          const subtopics = await storage.getCurriculumSubtopicsByTopic(topic.id);
          const questionTags = await storage.getCurriculumQuestionTagsByTopic(topic.id);
          return { ...topic, subtopics, questionTags };
        })
      );

      res.json({ ...subject, topics: topicsWithDetails });
    } catch (error) {
      console.error("Error fetching curriculum subject details:", error);
      res.status(500).json({ message: "Failed to fetch subject details" });
    }
  });

  // Weekly Leaderboard endpoint
  app.get('/api/leaderboard/weekly', isAuthenticated, async (req, res) => {
    try {
      const { startOfWeek } = await import('./utils/week');
      const { WEEKLY_CHALLENGE } = await import('../shared/config/challenge');
      const weekStart = startOfWeek(new Date(), WEEKLY_CHALLENGE.weekStartsOn);
      
      const leaderboard = await storage.getWeeklyLeaderboard(weekStart);
      res.json({ rows: leaderboard });
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        res.send({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
        return;
      }

      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      });

      await storage.updateStripeCustomerId(userId, customer.id);

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: req.body.priceId, // Pass from frontend
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, {
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id
      });

      res.send({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
