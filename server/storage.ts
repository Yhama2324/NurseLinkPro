import {
  users,
  posts,
  likes,
  comments,
  quizzes,
  questions,
  quizAttempts,
  clans,
  parties,
  clanMembers,
  partyMembers,
  badges,
  reviewCenters,
  jobs,
  advertisements,
  dailyChallenges,
  leaderboards,
  aiChatConversations,
  aiChatMessages,
  aiStudyPlans,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Quiz,
  type InsertQuiz,
  type Question,
  type InsertQuestion,
  type QuizAttempt,
  type Clan,
  type InsertClan,
  type Party,
  type InsertParty,
  type Badge,
  type ReviewCenter,
  type InsertReviewCenter,
  type Job,
  type InsertJob,
  type Advertisement,
  type InsertAd,
  type Leaderboard,
  type AiChatConversation,
  type InsertAiConversation,
  type AiChatMessage,
  type InsertAiMessage,
  type AiStudyPlan,
  type InsertAiStudyPlan,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserXP(id: string, xp: number): Promise<void>;
  updateUserStreak(id: string, streak: number): Promise<void>;
  updateStripeCustomerId(id: string, customerId: string): Promise<User>;
  updateUserStripeInfo(id: string, info: { stripeCustomerId: string; stripeSubscriptionId: string }): Promise<User>;
  
  // Posts operations
  getAllPosts(): Promise<(Post & { user?: User })[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  likePost(postId: number, userId: string): Promise<void>;
  unlikePost(postId: number, userId: string): Promise<void>;
  addComment(comment: InsertComment): Promise<Comment>;
  
  // Quiz operations
  getAllQuizzes(): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByQuiz(quizId: number): Promise<Question[]>;
  saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt>;
  
  // Clans operations
  getAllClans(): Promise<Clan[]>;
  createClan(clan: InsertClan): Promise<Clan>;
  joinClan(clanId: number, userId: string): Promise<void>;
  
  // Parties operations
  getAllParties(): Promise<Party[]>;
  createParty(party: InsertParty): Promise<Party>;
  
  // Review Centers operations
  getAllReviewCenters(): Promise<ReviewCenter[]>;
  createReviewCenter(center: InsertReviewCenter): Promise<ReviewCenter>;
  
  // Jobs operations
  getAllJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Advertisements operations
  getAllAds(): Promise<Advertisement[]>;
  createAd(ad: InsertAd): Promise<Advertisement>;
  
  // Leaderboard operations
  getLeaderboard(quizId?: number): Promise<Leaderboard[]>;
  getUserBadges(userId: string): Promise<Badge[]>;
  getDailyChallenge(): Promise<Quiz | undefined>;

  // AI Copilot operations
  createAiConversation(conversation: InsertAiConversation): Promise<AiChatConversation>;
  getAiConversations(userId: string): Promise<AiChatConversation[]>;
  getAiConversationMessages(conversationId: number): Promise<AiChatMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiChatMessage>;
  createStudyPlan(plan: InsertAiStudyPlan): Promise<AiStudyPlan>;
  getUserStudyPlans(userId: string): Promise<AiStudyPlan[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserXP(id: string, xp: number): Promise<void> {
    await db
      .update(users)
      .set({ xp: sql`${users.xp} + ${xp}`, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async updateUserStreak(id: string, streak: number): Promise<void> {
    await db
      .update(users)
      .set({ streak, lastActiveDate: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async updateStripeCustomerId(id: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, info: { stripeCustomerId: string; stripeSubscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: info.stripeCustomerId,
        stripeSubscriptionId: info.stripeSubscriptionId,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Posts operations
  async getAllPosts(): Promise<(Post & { user?: User })[]> {
    const result = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));
    
    return result.map(row => ({
      ...row.posts,
      user: row.users || undefined
    }));
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async likePost(postId: number, userId: string): Promise<void> {
    await db.insert(likes).values({ postId, userId });
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async unlikePost(postId: number, userId: string): Promise<void> {
    await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, comment.postId));
    return newComment;
  }

  // Quiz operations
  async getAllQuizzes(): Promise<Quiz[]> {
    return await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  async getQuestionsByQuiz(quizId: number): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(questions.orderIndex);
  }

  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
    const [newAttempt] = await db.insert(quizAttempts).values(attempt).returning();
    return newAttempt;
  }

  // Clans operations
  async getAllClans(): Promise<Clan[]> {
    return await db.select().from(clans).orderBy(clans.rank);
  }

  async createClan(clan: InsertClan): Promise<Clan> {
    const [newClan] = await db.insert(clans).values(clan).returning();
    await db.insert(clanMembers).values({
      clanId: newClan.id,
      userId: clan.creatorId,
      role: 'admin'
    });
    return newClan;
  }

  async joinClan(clanId: number, userId: string): Promise<void> {
    await db.insert(clanMembers).values({ clanId, userId });
    await db
      .update(clans)
      .set({ memberCount: sql`${clans.memberCount} + 1` })
      .where(eq(clans.id, clanId));
  }

  // Parties operations
  async getAllParties(): Promise<Party[]> {
    return await db.select().from(parties).orderBy(desc(parties.createdAt));
  }

  async createParty(party: InsertParty): Promise<Party> {
    const [newParty] = await db.insert(parties).values(party).returning();
    await db.insert(partyMembers).values({
      partyId: newParty.id,
      userId: party.creatorId,
      role: 'admin'
    });
    return newParty;
  }

  // Review Centers operations
  async getAllReviewCenters(): Promise<ReviewCenter[]> {
    return await db
      .select()
      .from(reviewCenters)
      .where(eq(reviewCenters.isActive, true))
      .orderBy(desc(reviewCenters.createdAt));
  }

  async createReviewCenter(center: InsertReviewCenter): Promise<ReviewCenter> {
    const [newCenter] = await db.insert(reviewCenters).values(center).returning();
    return newCenter;
  }

  // Jobs operations
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  // Advertisements operations
  async getAllAds(): Promise<Advertisement[]> {
    return await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.isActive, true))
      .orderBy(desc(advertisements.createdAt));
  }

  async createAd(ad: InsertAd): Promise<Advertisement> {
    const [newAd] = await db.insert(advertisements).values(ad).returning();
    return newAd;
  }

  // Leaderboard operations
  async getLeaderboard(quizId?: number): Promise<Leaderboard[]> {
    if (quizId) {
      return await db
        .select()
        .from(leaderboards)
        .where(eq(leaderboards.quizId, quizId))
        .orderBy(desc(leaderboards.score));
    }
    return await db.select().from(leaderboards).orderBy(desc(leaderboards.score));
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.userId, userId));
  }

  async getDailyChallenge(): Promise<Quiz | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [challenge] = await db
      .select()
      .from(dailyChallenges)
      .leftJoin(quizzes, eq(dailyChallenges.quizId, quizzes.id))
      .where(eq(dailyChallenges.date, today))
      .limit(1);
    
    return challenge?.quizzes;
  }

  // AI Copilot operations
  async createAiConversation(conversation: InsertAiConversation): Promise<AiChatConversation> {
    const [newConversation] = await db.insert(aiChatConversations).values(conversation).returning();
    return newConversation;
  }

  async getAiConversations(userId: string): Promise<AiChatConversation[]> {
    return await db
      .select()
      .from(aiChatConversations)
      .where(eq(aiChatConversations.userId, userId))
      .orderBy(desc(aiChatConversations.updatedAt));
  }

  async getAiConversationMessages(conversationId: number): Promise<AiChatMessage[]> {
    return await db
      .select()
      .from(aiChatMessages)
      .where(eq(aiChatMessages.conversationId, conversationId))
      .orderBy(aiChatMessages.createdAt);
  }

  async createAiMessage(message: InsertAiMessage): Promise<AiChatMessage> {
    const [newMessage] = await db.insert(aiChatMessages).values(message).returning();
    
    // Update conversation's updatedAt timestamp
    await db
      .update(aiChatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(aiChatConversations.id, message.conversationId));
    
    return newMessage;
  }

  async createStudyPlan(plan: InsertAiStudyPlan): Promise<AiStudyPlan> {
    const [newPlan] = await db.insert(aiStudyPlans).values(plan).returning();
    return newPlan;
  }

  async getUserStudyPlans(userId: string): Promise<AiStudyPlan[]> {
    return await db
      .select()
      .from(aiStudyPlans)
      .where(eq(aiStudyPlans.userId, userId))
      .orderBy(desc(aiStudyPlans.createdAt));
  }
}

export const storage = new DatabaseStorage();
