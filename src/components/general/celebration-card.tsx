import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CelebrationCard() {
  return (
    <Card className="relative max-w-xl overflow-hidden bg-muted/10 dark:bg-card text-card-foreground rounded-xl border py-6">
      {/* Confetti background image */}
      <img
        src="/star-shape.png"
        alt="confetti"
        className="pointer-events-none absolute inset-0 object-fit"
      />

      <CardHeader className="px-6">
        <CardTitle className="text-2xl font-semibold">
          Congratulations Toby! 🎉
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Best seller of the month
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-display">$15,231.89</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500">+65%</span> from last month
            </div>
          </div>
          <Button variant="secondary">View Sales</Button>
        </div>
      </CardContent>
    </Card>
  );
}
