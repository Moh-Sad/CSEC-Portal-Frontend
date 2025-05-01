"use client";

interface HoverCardTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function HoverCardTrigger({
  children,
  asChild = false,
  className = "",
}: HoverCardTriggerProps) {
  if (asChild) {
    return <>{children}</>;
  }
  return <div className={`inline-block ${className}`}>{children}</div>;
}