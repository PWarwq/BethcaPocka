import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "brass" | "outline" | "quiet";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[0.3rem] font-medium " +
  "transition-[background-color,border-color,color,transform] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  // The brass rail: the one loud element on the page.
  brass:
    "bg-brass-500 text-baize-950 hover:bg-brass-400 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset]",
  outline:
    "border border-brass-700/70 text-brass-300 hover:border-brass-500 hover:text-brass-400 hover:bg-brass-500/8",
  quiet: "text-bone-300 hover:text-bone-50",
};

const SIZES = {
  sm: "h-9 px-3.5 text-[0.85rem]",
  md: "h-11 px-5 text-[0.92rem]",
  lg: "h-13 px-7 text-[1rem]",
} as const;

export function buttonStyles({
  variant = "brass",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  className?: string;
} = {}) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
};

export function Button({
  variant = "brass",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}