import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Small eyebrow label shown above section headings.
 * Consistent spacing + typography across the site.
 */
export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`
        inline-flex items-center
        text-[11px]
        sm:text-xs
        font-semibold
        uppercase
        tracking-[0.22em]
        text-[#671372]
        dark:text-[#c44cf0]
        mb-4
        ${className}
      `}
    >
      {children}
    </p>
  );
}
