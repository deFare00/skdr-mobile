import React from "react";

interface KemenkesLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  textColor?: string;
  alt?: string;
}

export default function KemenkesLogo({
  className = "",
  size = "md",
  textColor,
  alt = "Logo Kementerian Kesehatan Republik Indonesia",
}: KemenkesLogoProps) {
  const heights = {
    sm: "h-7 sm:h-8",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Official Logo-Kemenkes.png */}
      <img
        src="/images/Logo-Kemenkes.png"
        alt={alt}
        className={`${heights[size]} w-auto object-contain max-w-full`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
