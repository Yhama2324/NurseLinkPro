import { Check } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Subscriptions() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Upgrade Your Learning" />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Unlock powerful features to accelerate your nursing journey
          </p>
        </div>

        <div className="space-y-4">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "p-6 space-y-4 relative",
                tier.popular && "ring-2 ring-primary"
              )}
              data-testid={`subscription-${tier.name.toLowerCase()}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-2">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.currency}{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground">{tier.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-chart-3 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  tier.popular && "bg-primary"
                )}
                variant={tier.popular ? "default" : "secondary"}
                data-testid={`button-subscribe-${tier.name.toLowerCase()}`}
              >
                {tier.price === 0 ? "Current Plan" : "Subscribe Now"}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3">Why Upgrade?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Unlimited access to AI-generated quizzes</li>
            <li>✓ Advanced analytics to track your progress</li>
            <li>✓ Join competitive clan wars and challenges</li>
            <li>✓ Priority support from our team</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
