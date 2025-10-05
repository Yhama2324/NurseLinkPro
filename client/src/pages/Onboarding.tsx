import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Subject {
  id: number;
  canonicalCode: string;
  name: string;
  units: number;
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [schoolName, setSchoolName] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [term, setTerm] = useState(1);
  const [yearLevel, setYearLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/enrollee/subjects"],
    enabled: step === 2,
  });

  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/enrollee/onboarding/complete", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/home");
    },
  });

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.canonicalCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSubject = (subject: Subject) => {
    if (selectedSubjects.find((s) => s.id === subject.id)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleComplete = () => {
    completeMutation.mutate({
      schoolName: schoolName || null,
      academicYear,
      term,
      yearLevel,
      selectedSubjects: selectedSubjects.map(s => ({
        id: s.id,
        schoolCode: s.canonicalCode,
        units: s.units,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Welcome to CKalingaLink</CardTitle>
          <CardDescription>
            Let's personalize your learning experience
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">School & Semester Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="school" data-testid="label-school">School Name (Optional)</Label>
                <Input
                  id="school"
                  data-testid="input-school"
                  placeholder="e.g., University of the Philippines Manila"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ay" data-testid="label-academic-year">Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger id="ay" data-testid="select-academic-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term" data-testid="label-term">Semester</Label>
                  <Select value={String(term)} onValueChange={(v) => setTerm(Number(v))}>
                    <SelectTrigger id="term" data-testid="select-term">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" data-testid="label-year-level">Year Level</Label>
                <Select value={String(yearLevel)} onValueChange={(v) => setYearLevel(Number(v))}>
                  <SelectTrigger id="year" data-testid="select-year-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Pre-nursing</SelectItem>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                data-testid="button-next-step1"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Your Subjects</h3>
              <p className="text-sm text-muted-foreground">
                Choose the subjects you're currently enrolled in
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-subjects"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((s) => (
                  <Badge
                    key={s.id}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleToggleSubject(s)}
                    data-testid={`badge-selected-${s.id}`}
                  >
                    {s.name} ({s.canonicalCode})
                  </Badge>
                ))}
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {filteredSubjects.map((subject) => {
                  const isSelected = !!selectedSubjects.find((s) => s.id === subject.id);
                  return (
                    <div
                      key={subject.id}
                      className={`p-3 border-b last:border-b-0 cursor-pointer hover-elevate ${
                        isSelected ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleToggleSubject(subject)}
                      data-testid={`subject-item-${subject.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subject.canonicalCode} • {subject.units} units
                          </div>
                        </div>
                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  data-testid="button-back-step2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={selectedSubjects.length === 0}
                  data-testid="button-next-step2"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Study Plan</h3>
              <p className="text-sm text-muted-foreground">
                We've created a personalized study plan based on your enrolled subjects
              </p>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Drill</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    10 questions daily from your active subjects to keep your skills sharp
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    25 questions per subject every week for focused practice
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Monthly Mock Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    50-75 questions covering all your subjects, weighted by units
                  </p>
                </CardContent>
              </Card>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Selected Subjects ({selectedSubjects.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map((s) => (
                    <Badge key={s.id} variant="secondary">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  data-testid="button-back-step3"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1"
                  disabled={completeMutation.isPending}
                  data-testid="button-complete-onboarding"
                >
                  {completeMutation.isPending ? "Setting up..." : "Start Learning"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
