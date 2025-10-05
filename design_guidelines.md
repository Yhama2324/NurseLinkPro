# CKalingaLink Design Guidelines

## Design Approach

**Reference-Based Hybrid**: Drawing inspiration from Instagram (social feed), Duolingo (gamification), and LinkedIn (professional networking) while maintaining a compassionate, healthcare-focused identity. The design balances social engagement with educational seriousness, optimized for mobile-first experiences.

## Core Design Principles

1. **Mobile-First Excellence**: Every component designed for thumb-friendly interaction on 375px-428px viewports
2. **Compassionate Clarity**: Clean, calming interfaces that reduce study stress while maintaining focus
3. **Trust Through Design**: Professional aesthetics that signal security and legitimacy for an international platform
4. **Progressive Disclosure**: Information revealed contextually to avoid overwhelming users

## Color Palette

### Light Mode
- **Base**: 0 0% 100% (Pure white clinical backgrounds)
- **Secondary Panels**: 217 100% 90% (#C7DCFF - calm, trustworthy blue)
- **Accent/Warmth**: 300 100% 91% (#FFD0FD - empathy and care)
- **Primary CTA**: 207 100% 50% (#0080FF - focus and action)
- **Text Primary**: 220 20% 20% (soft black for readability)
- **Text Secondary**: 220 10% 50% (muted for hierarchy)
- **Success**: 142 76% 36% (achievements, correct answers)
- **Error**: 0 72% 51% (incorrect answers, alerts)
- **Warning**: 38 92% 50% (streaks, urgent notifications)

### Dark Mode
- **Base**: 220 20% 14% (deep blue-black)
- **Secondary Panels**: 217 30% 22% (elevated cards)
- **Accent/Warmth**: 300 50% 40% (muted empathy)
- **Primary CTA**: 207 100% 60% (brighter for contrast)
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 0 0% 70%

## Typography

**Primary Font Family**: 'Poppins' (Google Fonts) - modern, friendly, excellent mobile readability
**Secondary Font Family**: 'Nunito Sans' (Google Fonts) - for body text, statistics

### Type Scale (Mobile-First)
- **Hero/Splash**: text-4xl font-bold (36px) - Taglines, splash screen
- **Page Titles**: text-3xl font-semibold (30px) - Main headings
- **Section Headers**: text-xl font-semibold (20px) - Feed sections, quiz headers
- **Card Titles**: text-lg font-medium (18px) - Post titles, quiz questions
- **Body**: text-base font-normal (16px) - Post content, explanations
- **Small Text**: text-sm (14px) - Timestamps, metadata, stats
- **Micro Text**: text-xs (12px) - Labels, badges, disclaimer

## Layout System

**Tailwind Spacing Primitives**: 2, 3, 4, 6, 8, 12, 16, 20, 24
- **Component Padding**: p-4, p-6 (internal spacing)
- **Section Gaps**: gap-4, gap-6 (between cards/items)
- **Screen Margins**: px-4, px-6 (mobile screen edges)
- **Vertical Rhythm**: space-y-4, space-y-6, space-y-8

### Mobile Layout Patterns
- **Max Content Width**: max-w-md (mobile), max-w-4xl (desktop)
- **Safe Areas**: Account for notches with safe-area-inset padding
- **Bottom Navigation**: 64px fixed height with 4-5 primary tabs
- **Sticky Headers**: 56px height with shadow on scroll
- **Card Radius**: rounded-xl (12px) for soft, approachable feel
- **Modal Sheets**: Bottom sheets for mobile, centered modals for desktop

## Component Library

### Navigation
- **Bottom Tab Bar** (Mobile Primary)
  - Icons: CareSpace (home), Quizzes, Clans, Profile
  - Active state: Primary color fill + label
  - Inactive: gray-500 with subtle tap feedback
  - Badge indicators for notifications (red dot, count)

- **Top Header Bar**
  - Left: Back/Menu button
  - Center: Page title or logo
  - Right: Notifications, Search icons
  - Background: Backdrop blur on scroll

### Social Feed (CareSpace)
- **Post Card**
  - Avatar (40px) + username + timestamp
  - Post content with 3-line clamp, "Read more" expansion
  - Images: Full-width, rounded corners, max-h-96
  - Action bar: Like, Comment, Share icons (44px tap targets)
  - Hashtag chips: Pill-shaped, light blue background
  
### Quiz Interface
- **Question Card**
  - Timer: Circular progress ring (top-right, 48px)
  - Question number: "15/50" badge (top-left)
  - Question text: Large, bold, centered
  - Answer options: Full-width buttons with radio indicators
  - Submit/Next: Primary CTA button at bottom
  
- **Results Screen**
  - Score circle: Large animated percentage (120px)
  - XP gained: Celebratory animation
  - Correct/Incorrect breakdown: Color-coded bars
  - Review button: Secondary action

### Gamification Elements
- **XP Progress Bar**
  - Gradient fill (primary to accent)
  - Animated on update
  - Level indicators with milestone markers
  
- **Badges**
  - Circular icons (64px for earned, 48px for locked)
  - Grayscale filter for unearned
  - Popup modal with description on tap
  
- **Streak Counter**
  - Fire icon with days count
  - Warning animation when streak at risk
  - Celebration confetti for milestones

### Forms & Inputs
- **Text Fields**
  - Height: h-12 (48px for thumb accessibility)
  - Border: 2px, rounded-lg
  - Focus: Primary color ring
  - Error: Red border + helper text below
  
- **Buttons**
  - Primary: bg-primary, white text, h-12, rounded-lg
  - Secondary: Outline with primary border
  - Disabled: Opacity 50%
  - Loading: Spinner animation

### Data Display
- **Profile Stats Grid**
  - 3-column layout on mobile (XP, Streak, Rank)
  - Icon + number + label vertically stacked
  - Tappable to expand details
  
- **Leaderboard**
  - Rank medal icon + avatar + username + score
  - Top 3: Podium visual with gold/silver/bronze
  - Current user: Highlighted row with primary background

### Overlays & Modals
- **Bottom Sheets** (Mobile Primary)
  - Slide up animation
  - Handle bar at top
  - Dismissible by swipe down or backdrop tap
  
- **Full-Screen Modals**
  - For critical flows (subscriptions, settings)
  - Close button: Top-left or top-right
  - Slide-in from bottom animation

## Animations & Interactions

**Philosophy**: Subtle, purposeful animations that enhance understanding without distraction

- **Page Transitions**: Slide animations (200ms ease-out)
- **Button Taps**: Scale down to 0.95 (100ms)
- **Card Reveals**: Fade in + slight Y-translate (300ms)
- **Success Feedback**: Confetti burst or checkmark animation
- **Loading States**: Skeleton screens, not spinners
- **Pull-to-Refresh**: Elastic bounce with branded loader

## Images

### Hero/Splash Screen
**Large Background Image**: Diverse group of Filipino nursing students in scrubs, soft focus, warm lighting, compassionate expressions. Overlay with 40% dark gradient for text legibility. Display rotating tagline in white, bold text centered.

### CareSpace Feed Posts
**User-Generated Content**: Support full-width images (16:9 or 1:1 aspect ratio), lazy loading, compression for mobile data efficiency.

### Profile Achievements
**Badge Icons**: Custom illustrated icons representing nursing achievements (stethoscope, heart monitor, books, graduation cap). SVG format, colorful when earned, grayscale when locked.

### Empty States
**Friendly Illustrations**: Nurse character illustrations for empty feeds, zero quizzes, no clans joined. Soft pastel colors matching brand palette, encouraging users to take action.

### Review Centers & Job Listings
**Logo Uploads**: Institution logos (square format, 200x200px minimum), white backgrounds preferred for consistency in card displays.

## Mobile-Specific Considerations

- **Thumb Zones**: Primary actions within easy thumb reach (bottom 60% of screen)
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Font Scaling**: Respect user's device accessibility settings
- **Network Awareness**: Offline indicators, data-saving image modes
- **Haptic Feedback**: Subtle vibrations for button taps, achievements
- **Biometric Auth**: Face ID/Fingerprint integration for secure login
- **Dark Mode**: Auto-switch based on system preferences
- **Gestures**: Swipe to delete/archive, pinch to zoom images, pull to refresh

## Accessibility & Security Visual Cues

- **Verification Badges**: Blue checkmark icons for verified review centers, employers
- **Encryption Indicators**: Lock icons on payment/auth screens
- **Security Alerts**: Red warning banners for suspicious activity
- **ARIA Labels**: All interactive elements labeled for screen readers
- **High Contrast Mode**: Ensure 4.5:1 contrast ratio minimum
- **Focus Indicators**: Clear 2px outlines for keyboard navigation

This mobile-first design system creates a trustworthy, compassionate, and engaging learning environment that scales from Philippine nursing students to international users while maintaining security and accessibility standards.