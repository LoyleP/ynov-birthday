import { cn } from "@/lib/utils";

export const buttonClass = (variant: "default" | "outline" | "destructive" = "default") =>
  cn(
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-all active:translate-y-px disabled:opacity-50",
    variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "outline" && "border border-input bg-transparent hover:bg-accent",
    variant === "destructive" && "bg-destructive/10 text-destructive hover:bg-destructive/20",
  );

export const inputClass =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-all focus:border-ring focus:ring-3 focus:ring-ring/50";

export const Card = ({ className, ...p }: React.ComponentProps<"div">) => (
  <div className={cn("rounded-xl bg-card p-4 ring-1 ring-foreground/10", className)} {...p} />
);

export const Badge = ({ className, ...p }: React.ComponentProps<"span">) => (
  <span className={cn("inline-flex h-5 items-center rounded-4xl px-2 text-xs font-medium", className)} {...p} />
);

export function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
      <div className="text-muted-foreground [&_svg]:size-6">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
