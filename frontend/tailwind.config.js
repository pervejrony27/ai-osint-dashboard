/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0a0e1a",
          darker: "#060912",
          card: "#111827",
          border: "#1e293b",
          accent: "#06b6d4",
          glow: "#22d3ee",
          green: "#22c55e",
          red: "#ef4444",
          amber: "#f59e0b",
          purple: "#a855f7",
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px #06b6d4, 0 0 10px #06b6d4" },
          "50%": { boxShadow: "0 0 20px #06b6d4, 0 0 40px #06b6d4" },
        },
        scanLine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};