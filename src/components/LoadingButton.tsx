import type { ButtonHTMLAttributes } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export default function LoadingButton({
  children,
  className = "",
  loading = false,
  loadingText = "Working...",
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-3 rounded-2xl bg-emeraldDark px-4 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-75 ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin" />
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}
