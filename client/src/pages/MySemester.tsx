import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Enrollment {
  id: number;
  userId: string;
  semesterId: number;
  subjectId: number;
  schoolCode: string | null;
  units: number;
  active: boolean;
  createdAt: string;
  subject?: {
    id: number;
    canonicalCode: string;
    name: string;
    units: number;
    active: boolean;
  };
  semester?: {
    id: number;
    schoolName: string | null;
    academicYear: string;
    term: number;
  };
}

export default function MySemester() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollee/enrollments"],
  });

  const activeEnrollments = enrollments.filter((e) => e.active);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-my-semester-title">My Semester</h1>
        <p className="text-muted-foreground">
          {activeEnrollments[0]?.semester?.academicYear} • Semester {activeEnrollments[0]?.semester?.term}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-subjects-count">
              {activeEnrollments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeEnrollments.reduce((sum, e) => sum + e.units, 0)} total units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10 Questions</div>
            <p className="text-xs text-muted-foreground">
              From your active subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 100</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Subjects</h2>
          <Button variant="outline" size="sm" data-testid="button-manage-subjects">
            Manage Subjects
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover-elevate" data-testid={`card-subject-${enrollment.subject?.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{enrollment.subject?.name}</CardTitle>
                    <CardDescription>
                      {enrollment.subject?.canonicalCode} • {enrollment.units} units
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{enrollment.active ? "Active" : "Paused"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Today's Drill</span>
                    <span className="font-medium">Not started</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weekly Quiz</span>
                    <span className="font-medium">Not started</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mastery</span>
                    <span className="font-medium">0%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" data-testid={`button-study-${enrollment.subject?.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Now
                  </Button>
                  <Button size="sm" variant="outline" data-testid={`button-insights-${enrollment.subject?.id}`}>
                    <Clock className="mr-2 h-4 w-4" />
                    Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeEnrollments.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Active Subjects</CardTitle>
              <CardDescription>
                You haven't enrolled in any subjects yet. Add subjects to start learning!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button data-testid="button-add-subjects">Add Subjects</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
