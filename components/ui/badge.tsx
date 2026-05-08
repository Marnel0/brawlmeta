import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  textColor?: string;
}

export function Badge({
  className,
  color,
  textColor,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-brand-ink font-bold text-xs uppercase tracking-wider",
        className
      )}
      style={{ backgroundColor: color, color: textColor, ...style }}
      {...props}
    />
  );
}
