import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Clock } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Jobs() {
  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Job Opportunities" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-chart-3/10 to-chart-1/10">
          <h3 className="font-bold mb-2">Post a Job Opening</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with qualified nursing graduates. ₱1,000 for 30 days.
          </p>
          <Button className="w-full" data-testid="button-post-job">
            Post Job
          </Button>
        </Card>

        <div className="space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="p-6 space-y-4 hover-elevate" data-testid={`job-${job.id}`}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{job.position}</h3>
                      <p className="text-sm text-muted-foreground">{job.hospitalName}</p>
                    </div>
                    {job.isPremium && (
                      <Badge className="bg-chart-4 shrink-0">Featured</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <p className="text-sm line-clamp-3">{job.description}</p>

                {job.requirements && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Requirements:</p>
                    <p className="text-sm text-muted-foreground">{job.requirements}</p>
                  </div>
                )}

                <Button className="w-full" data-testid="button-apply-job">
                  Apply Now
                </Button>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No job openings available yet</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
