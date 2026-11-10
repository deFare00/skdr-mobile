import React from "react";

export default function VectorBackground({
  className = "",
  opacity = 0.16,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Pattern Grid of Healthcare & Epidemiology Doodles */}

        {/* 1. Microscope (Top Right) */}
        <g transform="translate(760, 60) scale(0.9)">
          <path d="M 60 130 L 120 130" strokeWidth="3" />
          <path d="M 90 130 L 90 90" strokeWidth="3" />
          <path d="M 90 90 C 130 90 150 50 130 20 C 110 -10 70 0 70 30" strokeWidth="2.5" />
          <rect x="35" y="15" width="28" height="60" rx="4" transform="rotate(-30 45 45)" strokeWidth="2" />
          <circle cx="95" cy="55" r="14" strokeWidth="2" />
          <path d="M 50 100 L 90 100" strokeWidth="2.5" />
          <ellipse cx="70" cy="100" rx="15" ry="4" strokeWidth="2" />
        </g>

        {/* 2. Doctor with Stethoscope Silhouette (Top Center) */}
        <g transform="translate(480, 50) scale(0.85)">
          {/* Head & Mask */}
          <circle cx="60" cy="40" r="24" strokeWidth="2" />
          <path d="M 46 44 L 74 44 C 74 54 46 54 46 44 Z" strokeWidth="1.8" />
          {/* Cap */}
          <path d="M 36 32 C 36 14 84 14 84 32 Z" strokeWidth="2" />
          {/* Body / Coat */}
          <path d="M 30 85 C 20 95 10 130 10 160 L 110 160 C 110 130 100 95 90 85 Z" strokeWidth="2" />
          {/* Stethoscope */}
          <path d="M 45 85 C 45 115 50 125 60 125 C 70 125 75 115 75 85" strokeWidth="2" />
          <circle cx="60" cy="132" r="7" strokeWidth="2" />
          {/* ID Badge */}
          <rect x="72" y="102" width="18" height="24" rx="2" strokeWidth="1.8" />
        </g>

        {/* 3. Epidemiological Map / Signal Wave (Top Left) */}
        <g transform="translate(80, 80) scale(0.8)">
          <path d="M 20 20 L 50 10 L 80 25 L 110 15 L 110 95 L 80 105 L 50 90 L 20 100 Z" strokeWidth="2" />
          <path d="M 50 10 L 50 90" strokeDasharray="3 3" strokeWidth="1.8" />
          <path d="M 80 25 L 80 105" strokeDasharray="3 3" strokeWidth="1.8" />
          {/* Pin */}
          <circle cx="65" cy="50" r="8" strokeWidth="2" />
          <path d="M 65 58 L 65 72" strokeWidth="2.5" />
          <circle cx="65" cy="50" r="16" strokeDasharray="2 4" strokeWidth="1.5" />
        </g>

        {/* 4. Magnifying Glass & Virus Spores (Center Right) */}
        <g transform="translate(560, 260) scale(0.95)">
          <circle cx="60" cy="60" r="36" strokeWidth="3" />
          <path d="M 86 86 L 130 130" strokeWidth="4" />
          {/* Microbe inside */}
          <circle cx="60" cy="60" r="14" strokeWidth="2" />
          <line x1="60" y1="40" x2="60" y2="46" strokeWidth="2" />
          <line x1="60" y1="74" x2="60" y2="80" strokeWidth="2" />
          <line x1="40" y1="60" x2="46" y2="60" strokeWidth="2" />
          <line x1="74" y1="60" x2="80" y2="60" strokeWidth="2" />
          <circle cx="60" cy="38" r="2" fill="#ffffff" />
          <circle cx="60" cy="82" r="2" fill="#ffffff" />
          <circle cx="38" cy="60" r="2" fill="#ffffff" />
          <circle cx="82" cy="60" r="2" fill="#ffffff" />
        </g>

        {/* 5. Health Laptop / Data Analytics (Right Mid) */}
        <g transform="translate(750, 240) scale(0.85)">
          <rect x="20" y="20" width="100" height="65" rx="5" strokeWidth="2" />
          <path d="M 10 85 L 130 85 C 135 85 135 95 130 95 L 10 95 C 5 95 5 85 10 85 Z" strokeWidth="2" />
          {/* Bar Chart inside screen */}
          <line x1="35" y1="70" x2="35" y2="50" strokeWidth="4" />
          <line x1="50" y1="70" x2="50" y2="38" strokeWidth="4" />
          <line x1="65" y1="70" x2="65" y2="58" strokeWidth="4" />
          <line x1="80" y1="70" x2="80" y2="30" strokeWidth="4" />
          <line x1="95" y1="70" x2="95" y2="45" strokeWidth="4" />
          <path d="M 32 45 Q 60 25 100 35" strokeWidth="1.8" />
        </g>

        {/* 6. Medical Clipboard / PE Form (Center Left) */}
        <g transform="translate(100, 320) scale(0.85)">
          <rect x="25" y="25" width="85" height="115" rx="7" strokeWidth="2" />
          {/* Clip */}
          <rect x="50" y="15" width="35" height="18" rx="3" strokeWidth="2" />
          {/* Lines */}
          <line x1="40" y1="50" x2="95" y2="50" strokeWidth="2" />
          <line x1="40" y1="68" x2="95" y2="68" strokeWidth="2" />
          <line x1="40" y1="86" x2="85" y2="86" strokeWidth="2" />
          <line x1="40" y1="104" x2="95" y2="104" strokeWidth="2" />
          <line x1="40" y1="122" x2="75" y2="122" strokeWidth="2" />
          {/* Checkmarks */}
          <path d="M 33 49 L 36 52 L 42 45" strokeWidth="1.8" />
          <path d="M 33 67 L 36 70 L 42 63" strokeWidth="1.8" />
        </g>

        {/* 7. Heartbeat / ECG Wave with Cross (Center) */}
        <g transform="translate(320, 220) scale(0.9)">
          <path
            d="M 10 50 L 50 50 L 60 25 L 75 75 L 90 10 L 105 85 L 120 50 L 160 50"
            strokeWidth="2.5"
          />
          {/* Red Cross / Hospital badge */}
          <circle cx="195" cy="50" r="18" strokeWidth="2" />
          <path d="M 195 40 L 195 60" strokeWidth="3" />
          <path d="M 185 50 L 205 50" strokeWidth="3" />
        </g>

        {/* 8. Virus / Bacteria Spores (Bottom Right) */}
        <g transform="translate(780, 520) scale(0.9)">
          <circle cx="60" cy="60" r="28" strokeWidth="2" />
          {/* Spikes */}
          <line x1="60" y1="20" x2="60" y2="32" strokeWidth="2.2" />
          <line x1="60" y1="88" x2="60" y2="100" strokeWidth="2.2" />
          <line x1="20" y1="60" x2="32" y2="60" strokeWidth="2.2" />
          <line x1="88" y1="60" x2="100" y2="60" strokeWidth="2.2" />
          <line x1="32" y1="32" x2="40" y2="40" strokeWidth="2.2" />
          <line x1="80" y1="80" x2="88" y2="88" strokeWidth="2.2" />
          <line x1="32" y1="88" x2="40" y2="80" strokeWidth="2.2" />
          <line x1="80" y1="40" x2="88" y2="32" strokeWidth="2.2" />
          <circle cx="60" cy="20" r="3" fill="#ffffff" />
          <circle cx="60" cy="100" r="3" fill="#ffffff" />
          <circle cx="20" cy="60" r="3" fill="#ffffff" />
          <circle cx="100" cy="60" r="3" fill="#ffffff" />
        </g>

        {/* 9. Test Tube & Flask (Bottom Center) */}
        <g transform="translate(480, 560) scale(0.85)">
          {/* Flask */}
          <path d="M 45 20 L 45 40 L 15 90 C 10 100 20 110 30 110 L 80 110 C 90 110 100 100 95 90 L 65 40 L 65 20 Z" strokeWidth="2" />
          <path d="M 40 20 L 70 20" strokeWidth="2" />
          {/* Liquid level */}
          <path d="M 28 85 Q 55 95 82 85" strokeWidth="1.8" />
          <circle cx="45" cy="75" r="3" fill="#ffffff" />
          <circle cx="62" cy="68" r="2" fill="#ffffff" />
        </g>

        {/* 10. Syringe (Bottom Left) */}
        <g transform="translate(120, 620) scale(0.85)">
          <rect x="30" y="30" width="70" height="24" rx="2" transform="rotate(-40 65 42)" strokeWidth="2" />
          <line x1="35" y1="5" x2="10" y2="-20" strokeWidth="2" />
          <line x1="105" y1="75" x2="135" y2="105" strokeWidth="3" />
          <line x1="125" y1="115" x2="145" y2="95" strokeWidth="3" />
        </g>

        {/* 11. DNA Double Helix (Far Right) */}
        <g transform="translate(860, 360) scale(0.8)">
          <path d="M 20 10 Q 50 40 20 70 Q -10 100 20 130 Q 50 160 20 190" strokeWidth="2" />
          <path d="M 40 10 Q 10 40 40 70 Q 70 100 40 130 Q 10 160 40 190" strokeWidth="2" />
          <line x1="20" y1="25" x2="40" y2="25" strokeWidth="1.8" />
          <line x1="20" y1="55" x2="40" y2="55" strokeWidth="1.8" />
          <line x1="20" y1="85" x2="40" y2="85" strokeWidth="1.8" />
          <line x1="20" y1="115" x2="40" y2="115" strokeWidth="1.8" />
          <line x1="20" y1="145" x2="40" y2="145" strokeWidth="1.8" />
          <line x1="20" y1="175" x2="40" y2="175" strokeWidth="1.8" />
        </g>

        {/* 12. Digital Tablet / Health Worker checking EBS Alert (Far Bottom Left) */}
        <g transform="translate(60, 780) scale(0.85)">
          <rect x="20" y="20" width="90" height="120" rx="6" strokeWidth="2" />
          <circle cx="65" cy="130" r="4" strokeWidth="1.5" />
          {/* Alert Bell */}
          <path d="M 55 45 C 55 40 75 40 75 45 C 75 55 82 60 82 65 L 48 65 C 48 60 55 55 55 45 Z" strokeWidth="1.8" />
          <path d="M 60 67 C 60 70 70 70 70 67" strokeWidth="1.8" />
          <line x1="35" y1="85" x2="95" y2="85" strokeWidth="2" />
          <line x1="35" y1="100" x2="75" y2="100" strokeWidth="2" />
        </g>

        {/* 13. Epidemiological Network Nodes (Bottom Center Right) */}
        <g transform="translate(620, 740) scale(0.9)">
          <circle cx="40" cy="50" r="10" strokeWidth="2" />
          <circle cx="100" cy="20" r="8" strokeWidth="2" />
          <circle cx="120" cy="80" r="9" strokeWidth="2" />
          <circle cx="170" cy="40" r="11" strokeWidth="2" />
          <line x1="49" y1="46" x2="93" y2="25" strokeWidth="1.8" />
          <line x1="47" y1="56" x2="112" y2="76" strokeWidth="1.8" />
          <line x1="107" y1="24" x2="160" y2="36" strokeWidth="1.8" />
          <line x1="126" y1="74" x2="163" y2="47" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
}

