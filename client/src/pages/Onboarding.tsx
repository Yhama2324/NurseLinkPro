import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const SUBJECTS = [
  {
    id: "np1",
    label: "NP I — Community Health Nursing",
    emoji: "🌍",
    color: "border-red-400 bg-red-50",
  },
  {
    id: "np2",
    label: "NP II — Care of Mother & Child",
    emoji: "👶",
    color: "border-pink-400 bg-pink-50",
  },
  {
    id: "np3",
    label: "NP III — Physiologic Alterations A",
    emoji: "🏥",
    color: "border-blue-400 bg-blue-50",
  },
  {
    id: "np4",
    label: "NP IV — Physiologic Alterations B",
    emoji: "🩺",
    color: "border-green-400 bg-green-50",
  },
  {
    id: "np5",
    label: "NP V — Psychosocial Alterations",
    emoji: "🧠",
    color: "border-purple-400 bg-purple-50",
  },
];

const YEAR_LEVELS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "5", label: "Graduate / Board Taker" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  // Step 1 - Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [slogan, setSlogan] = useState("");

  // Step 2 - School
  const [school, setSchool] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  // Step 3 - Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/enrollee/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: () => {
      window.location.href = "/";
    },
  });

  const handleSkip = () => {
    window.location.href = "/";
  };

  const handleComplete = () => {
    completeMutation.mutate({
      firstName,
      lastName,
      gender,
      birthday,
      slogan,
      schoolName: school,
      yearLevel: yearLevel ? parseInt(yearLevel) : null,
      selectedSubjects,
    });
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to CKalingaLink
            </h1>
            <p className="text-sm text-gray-500">Let's set up your profile</p>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Skip
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${s <= step ? "bg-blue-500" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <Card className="p-6 shadow-lg rounded-2xl border-0">
          {/* Step 1 - Profile Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">
                👤 Your Profile
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                    First Name
                  </label>
                  <Input
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                    Last Name
                  </label>
                  <Input
                    placeholder="dela Cruz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Gender
                </label>
                <div className="flex gap-2">
                  {["Male", "Female", "Prefer not to say"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl border-2 text-xs font-medium transition-all ${gender === g ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500"}`}
                    >
                      {g === "Male"
                        ? "👨 Male"
                        : g === "Female"
                          ? "👩 Female"
                          : "🤝 Other"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Birthday
                </label>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Your Slogan / Motto{" "}
                  <span className="text-gray-400 normal-case">(optional)</span>
                </label>
                <Input
                  placeholder="e.g. I will pass the boards! 💪"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="rounded-xl h-11"
                  maxLength={60}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl h-11 font-semibold"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2 - School Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">
                🏫 School Information
              </h2>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  School / University{" "}
                  <span className="text-gray-400 normal-case">(optional)</span>
                </label>
                <Input
                  placeholder="e.g. UP Manila College of Nursing"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Year Level
                </label>
                <div className="space-y-2">
                  {YEAR_LEVELS.map((y) => (
                    <button
                      key={y.value}
                      type="button"
                      onClick={() => setYearLevel(y.value)}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${yearLevel === y.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      {yearLevel === y.value ? "✅" : "○"} {y.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl h-11"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl h-11 font-semibold"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 - Subjects */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  📚 Select Your Subjects
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the NP subjects you want to focus on. You can change
                  this later.
                </p>
              </div>

              <div className="space-y-2">
                {SUBJECTS.map((subj) => {
                  const selected = selectedSubjects.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => toggleSubject(subj.id)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${selected ? subj.color + " border-opacity-100" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{subj.emoji}</span>
                        <span
                          className={`text-sm font-medium flex-1 ${selected ? "text-gray-800" : "text-gray-600"}`}
                        >
                          {subj.label}
                        </span>
                        {selected && (
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl h-11"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl h-11 font-semibold"
                >
                  {completeMutation.isPending ? "Saving..." : "🚀 Get Started!"}
                </Button>
              </div>

              <button
                onClick={handleSkip}
                className="w-full text-xs text-gray-400 hover:text-gray-600 underline text-center"
              >
                Skip for now
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
