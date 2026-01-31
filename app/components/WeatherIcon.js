import React from "react";

const WeatherIcon = ({ condition, isNight }) => {
  const type = condition?.toLowerCase() || "clear";

  // Common SVG Props
  const svgProps = {
    viewBox: "0 0 64 64",
    width: "120", // Increased size as requested
    height: "120",
    fill: "none",
    className: "drop-shadow-2xl",
  };

  /* ================= ICONS DEFINITIONS ================= */

  // 1. CLEAR SKY (Sun or Moon)
  if (type.includes("clear")) {
    if (isNight) {
      return (
        <svg {...svgProps}>
          <defs>
            <linearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fae8b4" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            <filter id="moonGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M36 14c-8 0-14.8 4.2-18 10.5C21.5 29 27 35 34 35c7.5 0 14-5 16-12-2.5-5.5-8-9-14-9z"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
            className="animate-[pulse-glow_4s_infinite]"
          />
          <circle
            cx="20"
            cy="12"
            r="1.5"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <circle
            cx="50"
            cy="18"
            r="1"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <circle
            cx="10"
            cy="30"
            r="1"
            fill="white"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      );
    }
    return (
      <svg {...svgProps}>
        <defs>
          <radialGradient id="sunGrad">
            <stop offset="0%" stopColor="#FDB813" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
        {/* Rays */}
        <g className="animate-[sun-spin_12s_linear_infinite] origin-center">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="32"
              y1="12"
              x2="32"
              y2="4"
              transform={`rotate(${deg} 32 32)`}
              stroke="#FDB813"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* Core */}
        <circle
          cx="32"
          cy="32"
          r="14"
          fill="url(#sunGrad)"
          className="animate-[pulse-glow_3s_infinite]"
        />
      </svg>
    );
  }

  // 2. CLOUDS
  if (type.includes("cloud") || type.includes("overcast")) {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        {/* Back Cloud */}
        <path
          d="M44 24h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h15c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
          fill="url(#cloudGrad)"
          fillOpacity="0.6"
          transform="translate(8, -4)"
          className="animate-[cloud-float_6s_ease-in-out_infinite]"
        />
        {/* Front Cloud */}
        <path
          d="M40 30h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h21c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
          fill="url(#cloudGrad)"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
          className="animate-[cloud-float_5s_ease-in-out_infinite_reverse]"
        />
      </svg>
    );
  }

  // 3. RAIN / DRIZZLE
  if (type.includes("rain") || type.includes("drizzle")) {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id="rainCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M40 24h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h21c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
          fill="url(#rainCloudGrad)"
        />
        {/* Rain Drops */}
        <g fill="#60a5fa">
          <rect
            x="24"
            y="38"
            width="2"
            height="6"
            rx="1"
            className="animate-[rain-drop_1s_linear_infinite]"
            style={{ animationDelay: "0s" }}
          />
          <rect
            x="32"
            y="38"
            width="2"
            height="6"
            rx="1"
            className="animate-[rain-drop_1.2s_linear_infinite]"
            style={{ animationDelay: "0.4s" }}
          />
          <rect
            x="40"
            y="38"
            width="2"
            height="6"
            rx="1"
            className="animate-[rain-drop_0.8s_linear_infinite]"
            style={{ animationDelay: "0.2s" }}
          />
        </g>
      </svg>
    );
  }

  // 4. SNOW
  if (type.includes("snow")) {
    return (
      <svg {...svgProps}>
        <path
          d="M40 24h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h21c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
          fill="#f1f5f9"
        />
        {/* Snow Flakes */}
        <g fill="white">
          <circle
            cx="24"
            cy="40"
            r="1.5"
            className="animate-[snow-fall_2s_linear_infinite]"
          />
          <circle
            cx="34"
            cy="44"
            r="1.5"
            className="animate-[snow-fall_2.5s_linear_infinite]"
            style={{ animationDelay: "0.5s" }}
          />
          <circle
            cx="42"
            cy="38"
            r="1.5"
            className="animate-[snow-fall_2.2s_linear_infinite]"
            style={{ animationDelay: "1s" }}
          />
        </g>
      </svg>
    );
  }

  // 5. THUNDERSTORM
  if (type.includes("thunder") || type.includes("storm")) {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <path
          d="M40 24h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h21c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
          fill="url(#stormGrad)"
        />
        {/* Lightning */}
        <path
          d="M30 36L26 44h6l-2 8 8-10h-6l4-6h-6z"
          fill="#fcd34d"
          stroke="white"
          strokeWidth="0.5"
          className="animate-[lightning-flash_2s_infinite]"
        />
      </svg>
    );
  }

  // 6. MIST / FOG
  if (type.includes("mist") || type.includes("fog") || type.includes("haze")) {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id="mistGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
        </defs>
        <rect
          x="18"
          y="20"
          width="28"
          height="4"
          rx="2"
          fill="url(#mistGrad)"
          className="animate-[cloud-float_4s_ease-in-out_infinite]"
        />
        <rect
          x="14"
          y="28"
          width="36"
          height="4"
          rx="2"
          fill="url(#mistGrad)"
          className="animate-[cloud-float_5s_ease-in-out_infinite_reverse]"
        />
        <rect
          x="22"
          y="36"
          width="20"
          height="4"
          rx="2"
          fill="url(#mistGrad)"
          className="animate-[cloud-float_6s_ease-in-out_infinite]"
        />
      </svg>
    );
  }

  // DEFAULT (Partly Cloudy)
  return (
    <svg {...svgProps}>
      <circle cx="36" cy="22" r="10" fill="#FDB813" />
      <path
        d="M40 30h-1c0-5-4-9-9-9s-9 4-9 9h-2c-3.3 0-6 2.7-6 6s2.7 6 6 6h21c3.3 0 6-2.7 6-6s-2.7-6-6-6z"
        fill="#e2e8f0"
        className="animate-[cloud-float_6s_ease-in-out_infinite]"
      />
    </svg>
  );
};

export default WeatherIcon;
