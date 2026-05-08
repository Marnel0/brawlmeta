import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variants = {
  primary:
    "bg-brand-yellow text-brand-ink border-2 border-brand-ink shadow-cartoon-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-cartoon-pressed active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  outline:
    "bg-brand-paper text-brand-ink border-2 border-brand-ink shadow-cartoon-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-cartoon-pressed active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  ghost:
    "bg-transparent text-brand-ink border-2 border-transparent hover:border-brand-ink hover:shadow-cartoon-xs",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-xl font-bold",
  md: "px-5 py-2.5 text-sm rounded-xl font-bold",
  lg: "px-7 py-3.5 text-base rounded-xl font-bold",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-150 ease-snappy cursor-pointer select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
