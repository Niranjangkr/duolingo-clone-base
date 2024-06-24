import { Button } from "@/components/ui/button";
import { cn } from "../../utils/cn";
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { title } from "process";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  description,
  title,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <Card className="w-full max-w-sm bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow">
      <Link href="#" prefetch={false}>
        <CardContent className="flex flex-col justify-between h-full">
          <div className="p-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Quiz Course</div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
          <Button variant="primary">Start</Button>
        </CardContent>
      </Link>
    </Card>
  );
};
