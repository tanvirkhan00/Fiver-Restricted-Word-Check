import React from "react";

export function BrandLogo({ size = 34, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-svg-logo ${className}`}
      aria-label="Fiverr Safety Logo"
    >
      <defs>
        <radialGradient id="brBgGrad" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#141E34" />
          <stop offset="70%" stop-color="#080C16" />
          <stop offset="100%" stop-color="#04060A" />
        </radialGradient>

        <linearGradient id="brEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00F293" />
          <stop offset="50%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>

        <linearGradient id="brGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#15213B" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0A101C" stop-opacity="0.98" />
        </linearGradient>
      </defs>

      {/* Squiricle background badge */}
      <rect width="512" height="512" rx="116" fill="url(#brBgGrad)" />
      <rect width="508" height="508" x="2" y="2" rx="114" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" />

      {/* Cyber shield outer */}
      <path
        d="M256 56 L398 108 C398 238 344 382 256 454 C168 382 114 238 114 108 Z"
        fill="url(#brEmeraldGrad)"
      />

      {/* Dark Tech Shield Core */}
      <path
        d="M256 74 L380 120 C380 232 334 354 256 422 C178 354 132 232 132 120 Z"
        fill="url(#brGlassGrad)"
      />

      {/* Inner Rim Highlight */}
      <path
        d="M256 86 L368 128 C368 226 326 336 256 398 C186 336 144 226 144 128 Z"
        fill="none"
        stroke="rgba(0, 242, 147, 0.28)"
        stroke-width="3.5"
      />

      {/* Aerodynamic Chat Bubble */}
      <path
        d="M184 178 C184 148 208 124 238 124 H318 C348 124 372 148 372 178 V232 C372 262 348 286 318 286 H250 L204 322 C196 328 184 322 184 312 V286 C184 286 184 178 178 178 Z"
        fill="#070B13"
        stroke="rgba(0, 242, 147, 0.4)"
        stroke-width="4.5"
      />

      {/* Razor Sharp Checkmark Emblem */}
      <path
        d="M228 214 L264 250 L338 172"
        fill="none"
        stroke="url(#brEmeraldGrad)"
        stroke-width="26"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      {/* Top right pulse node */}
      <circle cx="376" cy="120" r="14" fill="#00F293" />
      <circle cx="376" cy="120" r="6" fill="#FFFFFF" />

      {/* Bottom radar micro-dots */}
      <circle cx="256" cy="376" r="7" fill="#00F293" />
      <circle cx="230" cy="368" r="4.5" fill="#10B981" opacity="0.85" />
      <circle cx="282" cy="368" r="4.5" fill="#10B981" opacity="0.85" />
    </svg>
  );
}
