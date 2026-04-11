import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, FileText, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

const TABS = [
  { id: "terms", label: "Terms of Use", icon: FileText },
  { id: "user-policy", label: "User Policy", icon: Shield },
  { id: "privacy", label: "Privacy Policy", icon: Lock },
];

export default function TermsAndPolicies() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1 as any)}>
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-800">Legal & Policies</span>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto sticky top-14 z-10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4 pb-10">
        {/* TERMS OF USE */}
        {activeTab === "terms" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📋</div>
              <h1 className="text-xl font-bold text-gray-800">Terms of Use</h1>
              <p className="text-xs text-gray-400 mt-1">
                Effective Date: April 11, 2026
              </p>
            </div>

            {[
              {
                title: "1. Acceptance of Terms",
                content:
                  "By accessing or using CKalingaLink, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform. These terms apply to all users, including students, healthcare professionals, and visitors.",
              },
              {
                title: "2. Description of Service",
                content:
                  "CKalingaLink is an educational platform designed to help nursing students prepare for the Philippine Nurse Licensure Examination (PNLE). We provide practice questions, study materials, progress tracking, and community features.",
              },
              {
                title: "3. User Accounts",
                content:
                  "You must create an account to access most features. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. You must be at least 18 years old to create an account, or have parental consent if younger.",
              },
              {
                title: "4. Acceptable Use",
                content:
                  "You agree to use CKalingaLink only for lawful purposes. You may not: share your account with others, reproduce or distribute our content without permission, attempt to hack or disrupt our services, post false, misleading, or harmful content, or use our platform for commercial purposes without authorization.",
              },
              {
                title: "5. Intellectual Property",
                content:
                  "All content on CKalingaLink, including questions, explanations, graphics, and software, is owned by or licensed to CKalingaLink. You may not copy, distribute, or create derivative works from our content without explicit written permission.",
              },
              {
                title: "6. Subscription and Payments",
                content:
                  "Some features require a paid subscription. Subscription fees are charged in Philippine Peso (PHP). All payments are processed securely. Subscriptions auto-renew unless cancelled. Refunds are handled on a case-by-case basis within 7 days of purchase.",
              },
              {
                title: "7. Disclaimer of Warranties",
                content:
                  "CKalingaLink is provided 'as is' without warranties of any kind. We do not guarantee that our content will result in passing the PNLE. We are not responsible for any errors in our study materials. Always cross-reference with official PRC/BON guidelines.",
              },
              {
                title: "8. Limitation of Liability",
                content:
                  "CKalingaLink shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability shall not exceed the amount you paid for your subscription in the past 12 months.",
              },
              {
                title: "9. Changes to Terms",
                content:
                  "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of the platform after changes constitutes acceptance of the new terms.",
              },
              {
                title: "10. Contact Us",
                content:
                  "For questions about these Terms of Use, please contact us at support@ckalingalink.com or through our in-app support feature.",
              },
            ].map((section) => (
              <Card key={section.title} className="p-4">
                <h3 className="font-bold text-sm text-blue-600 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* USER POLICY */}
        {activeTab === "user-policy" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🛡️</div>
              <h1 className="text-xl font-bold text-gray-800">User Policy</h1>
              <p className="text-xs text-gray-400 mt-1">
                Effective Date: April 11, 2026
              </p>
            </div>

            {[
              {
                title: "1. Community Standards",
                content:
                  "CKalingaLink is a respectful learning community. We expect all users to treat each other with respect and professionalism. Harassment, bullying, discrimination, or abusive behavior will result in immediate account suspension.",
              },
              {
                title: "2. Academic Integrity",
                content:
                  "Users must not share exam questions, answers, or materials that violate the PRC/BON's examination confidentiality rules. CKalingaLink content is for personal study only and must not be used to gain unfair advantages in official examinations.",
              },
              {
                title: "3. Content Guidelines",
                content:
                  "Users may not post content that is: offensive, discriminatory, or hateful; sexually explicit or inappropriate; false or misleading medical information; promotional spam or advertisements; or content that violates any Philippine laws.",
              },
              {
                title: "4. Account Sharing",
                content:
                  "Account sharing is strictly prohibited. Each account is for one individual user only. Sharing accounts may result in permanent suspension. If we detect multiple users on one account, we reserve the right to suspend the account without refund.",
              },
              {
                title: "5. Fair Use of Resources",
                content:
                  "Users agree to use platform resources fairly. Automated access, bots, or scraping of our content is strictly prohibited. Excessive API calls or attempts to circumvent rate limits may result in temporary or permanent suspension.",
              },
              {
                title: "6. Reporting Violations",
                content:
                  "If you encounter content or behavior that violates our policies, please report it immediately through our in-app reporting feature. We take all reports seriously and investigate them promptly.",
              },
              {
                title: "7. Enforcement",
                content:
                  "Violations of this policy may result in: warning notifications, temporary account suspension, permanent account termination, or legal action if warranted. CKalingaLink reserves the right to take action at its sole discretion.",
              },
              {
                title: "8. Appeals Process",
                content:
                  "If you believe your account was suspended in error, you may appeal by contacting support@ckalingalink.com within 30 days of suspension. Include your registered email and a description of the situation.",
              },
            ].map((section) => (
              <Card key={section.title} className="p-4">
                <h3 className="font-bold text-sm text-blue-600 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* PRIVACY POLICY */}
        {activeTab === "privacy" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔒</div>
              <h1 className="text-xl font-bold text-gray-800">
                Privacy Policy
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Effective Date: April 11, 2026
              </p>
            </div>

            {[
              {
                title: "1. Information We Collect",
                content:
                  "We collect: Registration information (name, email, school, year level); Quiz and study activity data; Device and browser information; Payment information (processed securely by our payment provider); Communication data when you contact support.",
              },
              {
                title: "2. How We Use Your Information",
                content:
                  "We use your information to: Provide and improve our educational services; Track your study progress and performance; Personalize your learning experience; Send important notifications and updates; Process payments securely; Ensure platform security and prevent fraud.",
              },
              {
                title: "3. Data Storage and Security",
                content:
                  "Your data is stored on secure servers. We use industry-standard encryption (SSL/TLS) for all data transmission. Passwords are hashed and never stored in plain text. We regularly backup data to prevent loss. Our servers are hosted in secure data centers.",
              },
              {
                title: "4. Information Sharing",
                content:
                  "We do not sell, trade, or rent your personal information to third parties. We may share data with: Service providers who help us operate our platform; Legal authorities when required by Philippine law; Analytics providers (in anonymized form only).",
              },
              {
                title: "5. Cookies and Tracking",
                content:
                  "We use cookies to maintain your session and remember your preferences. We may use analytics tools to understand how users interact with our platform. You can disable cookies in your browser settings, but this may affect functionality.",
              },
              {
                title: "6. Your Rights",
                content:
                  "Under the Philippine Data Privacy Act of 2012 (RA 10173), you have the right to: Access your personal data; Correct inaccurate information; Request deletion of your data; Withdraw consent at any time; File a complaint with the National Privacy Commission.",
              },
              {
                title: "7. Data Retention",
                content:
                  "We retain your data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law. Anonymized analytics data may be retained indefinitely.",
              },
              {
                title: "8. Children's Privacy",
                content:
                  "CKalingaLink is intended for users 18 years and older. We do not knowingly collect personal information from children under 18 without parental consent. If you believe we have collected information from a minor, please contact us immediately.",
              },
              {
                title: "9. Changes to Privacy Policy",
                content:
                  "We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. Your continued use of CKalingaLink after changes constitutes acceptance of the updated policy.",
              },
              {
                title: "10. Data Protection Officer",
                content:
                  "For privacy concerns, data requests, or to exercise your rights under RA 10173, contact our Data Protection Officer at: privacy@ckalingalink.com. We will respond to all requests within 15 business days.",
              },
            ].map((section) => (
              <Card key={section.title} className="p-4">
                <h3 className="font-bold text-sm text-blue-600 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
