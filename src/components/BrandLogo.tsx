type BrandLogoProps = {
  variant?: "mark" | "full";
  tone?: "light" | "dark";
  subtitle?: string;
  className?: string;
};

export default function BrandLogo({
  variant = "full",
  tone = "dark",
  subtitle,
  className = "",
}: BrandLogoProps) {
  const markSrc = tone === "light" ? "/logo-mark-light.svg" : "/logo-mark.svg";

  if (variant === "mark") {
    return (
      <img
        src={markSrc}
        alt="URBNLY"
        className={`block ${className}`}
      />
    );
  }

  const textColor = tone === "light" ? "text-white" : "text-emeraldDark";
  const subtitleColor = tone === "light" ? "text-white/70" : "text-fog";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img src={markSrc} alt="" aria-hidden="true" className="h-11 w-11 shrink-0" />
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-[0.24em] ${textColor}`}>
          URBNLY
        </span>
        {subtitle ? (
          <span className={`mt-1 block text-xs font-medium ${subtitleColor}`}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
