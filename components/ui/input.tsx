import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border-2 border-brand-ink bg-brand-paper text-brand-ink text-sm font-body",
          "shadow-cartoon-xs placeholder:text-brand-ink/40",
          "focus:outline-none focus:shadow-[3px_3px_0_0_#FFCC00] focus:border-brand-ink",
          "transition-shadow duration-150",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
