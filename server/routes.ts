import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import OpenAI from "openai";
import Stripe from "stripe";
import { insertPostSchema, insertCommentSchema, insertClanSchema, insertPartySchema, insertReviewCenterSchema, insertJobSchema, insertAdSchema } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI key: OPENAI_API_KEY');
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

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
      const { topic, category, difficulty, questionCount = 10 } = req.body;
      const userId = req.user.claims.sub;

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
            content: `Create ${questionCount} multiple choice questions about ${topic} at ${difficulty} difficulty level. Return a JSON array with this format:
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

      res.json(quiz);
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
      
      const xpEarned = correctAnswers * 10;
      
      const attempt = await storage.saveQuizAttempt({
        userId,
        quizId,
        score,
        correctAnswers,
        totalQuestions,
        xpEarned
      });

      // Update user XP
      await storage.updateUserXP(userId, xpEarned);

      res.json(attempt);
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
