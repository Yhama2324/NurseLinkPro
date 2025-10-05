import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Clock } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const SAMPLE_JOBS: Job[] = [
  {
    id: 1,
    hospitalName: "St. Luke's Medical Center",
    position: "Registered Nurse - ICU",
    description: "Join our intensive care unit team. We're looking for experienced RNs to provide critical care to our patients. Competitive salary and benefits package.",
    requirements: "Valid PRC license, ACLS certification, minimum 1 year ICU experience preferred",
    isPremium: true,
    price: 1500,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    hospitalName: "Makati Medical Center",
    position: "Emergency Room Nurse",
    description: "Seeking dynamic ER nurses to join our fast-paced emergency department. Great opportunity for professional growth.",
    requirements: "PRC license, BLS/ACLS, fresh graduates welcome to apply",
    isPremium: true,
    price: 1500,
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    hospitalName: "Philippine General Hospital",
    position: "Medical-Surgical Nurse",
    description: "Opportunity to work at the country's premier government hospital. Looking for compassionate nurses to join our med-surg team.",
    requirements: "PRC license required, fresh graduates are encouraged to apply",
    isPremium: false,
    price: 1000,
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    hospitalName: "Manila Doctors Hospital",
    position: "Pediatric Nurse",
    description: "Join our pediatric department and make a difference in children's lives. We offer excellent training and mentorship programs.",
    requirements: "PRC license, PALS certification preferred, passion for pediatric care",
    isPremium: false,
    price: 1000,
    expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    hospitalName: "The Medical City",
    position: "Operating Room Nurse",
    description: "Exciting opportunity in our state-of-the-art OR facilities. Work with cutting-edge technology and renowned surgeons.",
    requirements: "PRC license, OR training/experience preferred, willing to undergo training",
    isPremium: false,
    price: 1000,
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export default function Jobs() {
  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const displayJobs = jobs && jobs.length > 0 ? jobs : SAMPLE_JOBS;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Job Opportunities" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-chart-3/10 to-chart-1/10 card-reveal shimmer">
          <h3 className="font-bold mb-2">Post a Job Opening</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with qualified nursing graduates. ₱1,000 for 30 days.
          </p>
          <Button className="w-full" data-testid="button-post-job">
            Post Job
          </Button>
        </Card>

        <div className="space-y-4">
          {displayJobs.map((job, index) => (
            <Card key={job.id} className={`p-6 space-y-4 hover-elevate scale-on-hover card-reveal stagger-${Math.min(index + 1, 5)}`} data-testid={`job-${job.id}`}>
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
            ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
