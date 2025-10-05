import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table - Replit Auth integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  xp: integer("xp").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  rank: text("rank").default("Student").notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  lastQuizGenerationTime: timestamp("last_quiz_generation_time"),
  customQuizIntervalHours: integer("custom_quiz_interval_hours").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table - CareSpace social feed
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  hashtags: text("hashtags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Likes table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").default("medium").notNull(),
  createdById: varchar("created_by_id").references(() => users.id),
  isDaily: boolean("is_daily").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  rationale: text("rationale").notNull(),
  orderIndex: integer("order_index").notNull(),
});

// Quiz attempts table
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer("score").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  xpEarned: integer("xp_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Clans table
export const clans = pgTable("clans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  memberCount: integer("member_count").default(1).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  rank: integer("rank").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Parties table
export const parties = pgTable("parties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  memberCount: integer("member_count").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Clan members table
export const clanMembers = pgTable("clan_members", {
  id: serial("id").primaryKey(),
  clanId: integer("clan_id").notNull().references(() => clans.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// AI Copilot chat conversations
export const aiChatConversations = pgTable("ai_chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Copilot chat messages
export const aiChatMessages = pgTable("ai_chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiChatConversations.id, { onDelete: 'cascade' }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Study plans
export const aiStudyPlans = pgTable("ai_study_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  topics: jsonb("topics").notNull(), // Array of topics with details
  duration: integer("duration").notNull(), // Duration in days
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Party members table
export const partyMembers = pgTable("party_members", {
  id: serial("id").primaryKey(),
  partyId: integer("party_id").notNull().references(() => parties.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Badges table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeType: text("badge_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Review centers table
export const reviewCenters = pgTable("review_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").default(2000).notNull(),
  duration: integer("duration").default(40).notNull(),
  topnotchers: jsonb("topnotchers"),
  website: text("website"),
  contactInfo: text("contact_info"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  hospitalName: text("hospital_name").notNull(),
  position: text("position").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  isPremium: boolean("is_premium").default(false).notNull(),
  price: integer("price").default(1000),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Advertisements table
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  tier: text("tier").default("basic").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily challenges table
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  date: timestamp("date").notNull(),
  activeAt: timestamp("active_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Leaderboards table
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer("score").notNull(),
  rank: integer("rank"),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
});

// Curriculum tables - Secure backend storage
export const curriculumSubjects = pgTable("curriculum_subjects", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  year: integer("year").notNull(),
  semester: integer("semester").notNull(),
  hoursLec: integer("hours_lec").default(0).notNull(),
  hoursLab: integer("hours_lab").default(0).notNull(),
  hoursRle: integer("hours_rle").default(0).notNull(),
  prerequisites: text("prerequisites").array(),
  outcomes: text("outcomes").array(),
  pnleBlueprints: text("pnle_blueprints").array(),
  nclexBlueprints: text("nclex_blueprints").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const curriculumTopics = pgTable("curriculum_topics", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => curriculumSubjects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const curriculumSubtopics = pgTable("curriculum_subtopics", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => curriculumTopics.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const curriculumQuestionTags = pgTable("curriculum_question_tags", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => curriculumTopics.id, { onDelete: 'cascade' }),
  tag: varchar("tag").notNull(),
});

// Sessions table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  quizAttempts: many(quizAttempts),
  clansCreated: many(clans),
  partiesCreated: many(parties),
  clanMemberships: many(clanMembers),
  partyMemberships: many(partyMembers),
  badges: many(badges),
  leaderboardEntries: many(leaderboards),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  creator: one(users, {
    fields: [quizzes.createdById],
    references: [users.id],
  }),
  questions: many(questions),
  attempts: many(quizAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const clansRelations = relations(clans, ({ one, many }) => ({
  creator: one(users, {
    fields: [clans.creatorId],
    references: [users.id],
  }),
  members: many(clanMembers),
}));

export const partiesRelations = relations(parties, ({ one, many }) => ({
  creator: one(users, {
    fields: [parties.creatorId],
    references: [users.id],
  }),
  members: many(partyMembers),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likesCount: true,
  commentsCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertClanSchema = createInsertSchema(clans).omit({
  id: true,
  memberCount: true,
  totalXp: true,
  rank: true,
  createdAt: true,
});

export const insertPartySchema = createInsertSchema(parties).omit({
  id: true,
  memberCount: true,
  createdAt: true,
});

export const insertReviewCenterSchema = createInsertSchema(reviewCenters).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertAdSchema = createInsertSchema(advertisements).omit({
  id: true,
  impressions: true,
  clicks: true,
  createdAt: true,
});

export const insertAiConversationSchema = createInsertSchema(aiChatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiMessageSchema = createInsertSchema(aiChatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAiStudyPlanSchema = createInsertSchema(aiStudyPlans).omit({
  id: true,
  createdAt: true,
});

export const insertCurriculumSubjectSchema = createInsertSchema(curriculumSubjects).omit({
  id: true,
  createdAt: true,
});

export const insertCurriculumTopicSchema = createInsertSchema(curriculumTopics).omit({
  id: true,
  createdAt: true,
});

export const insertCurriculumSubtopicSchema = createInsertSchema(curriculumSubtopics).omit({
  id: true,
});

export const insertCurriculumQuestionTagSchema = createInsertSchema(curriculumQuestionTags).omit({
  id: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type Party = typeof parties.$inferSelect;
export type InsertParty = z.infer<typeof insertPartySchema>;
export type Badge = typeof badges.$inferSelect;
export type ReviewCenter = typeof reviewCenters.$inferSelect;
export type InsertReviewCenter = z.infer<typeof insertReviewCenterSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Advertisement = typeof advertisements.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiStudyPlan = typeof aiStudyPlans.$inferSelect;
export type InsertAiStudyPlan = z.infer<typeof insertAiStudyPlanSchema>;
export type CurriculumSubject = typeof curriculumSubjects.$inferSelect;
export type InsertCurriculumSubject = z.infer<typeof insertCurriculumSubjectSchema>;
export type CurriculumTopic = typeof curriculumTopics.$inferSelect;
export type InsertCurriculumTopic = z.infer<typeof insertCurriculumTopicSchema>;
export type CurriculumSubtopic = typeof curriculumSubtopics.$inferSelect;
export type InsertCurriculumSubtopic = z.infer<typeof insertCurriculumSubtopicSchema>;
export type CurriculumQuestionTag = typeof curriculumQuestionTags.$inferSelect;
export type InsertCurriculumQuestionTag = z.infer<typeof insertCurriculumQuestionTagSchema>;
