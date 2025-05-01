"use client";

interface HoverCardContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}

export function HoverCardContent({
  children,
  className = "",
  align = "center",
}: HoverCardContentProps) {
  const alignmentClasses = {
    start: "text-left",
    center: "text-center",
    end: "text-right",
  };

  return (
    <div className={`${alignmentClasses[align]} ${className}`}>{children}</div>
  );
}