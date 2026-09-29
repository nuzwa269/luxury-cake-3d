import type { ReactNode } from "react";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`button ${light ? "button-light" : ""} ${className}`}
    >
      {children}
      <Arrow />
    </a>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className="text-link">
      {children}
      <Arrow diagonal />
    </a>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span className={`monogram ${className}`} aria-hidden="true">
      m<span>n</span>
      <i />
    </span>
  );
}
