const particles = [
  {
    top: "18%",
    left: "12%",
    size: 3,
    duration: 9,
    delay: 0,
    color: "primary",
    drift: [12, -18],
  },
  {
    top: "28%",
    left: "82%",
    size: 4,
    duration: 11,
    delay: 1.2,
    color: "accent",
    drift: [-14, -20],
  },
  {
    top: "62%",
    left: "8%",
    size: 3,
    duration: 8,
    delay: 0.6,
    color: "accent",
    drift: [10, -14],
  },
  {
    top: "74%",
    left: "90%",
    size: 3,
    duration: 10,
    delay: 2,
    color: "primary",
    drift: [-10, -16],
  },
  {
    top: "10%",
    left: "48%",
    size: 2,
    duration: 7,
    delay: 0.3,
    color: "primary",
    drift: [8, -12],
  },
  {
    top: "85%",
    left: "45%",
    size: 3,
    duration: 12,
    delay: 1.6,
    color: "accent",
    drift: [-12, -18],
  },
  {
    top: "40%",
    left: "25%",
    size: 2,
    duration: 9,
    delay: 2.4,
    color: "accent",
    drift: [14, -10],
  },
  {
    top: "50%",
    left: "70%",
    size: 4,
    duration: 10,
    delay: 0.9,
    color: "primary",
    drift: [-8, -20],
  },
  {
    top: "20%",
    left: "65%",
    size: 2,
    duration: 8,
    delay: 1.8,
    color: "primary",
    drift: [10, -14],
  },
  {
    top: "68%",
    left: "58%",
    size: 3,
    duration: 11,
    delay: 0.4,
    color: "accent",
    drift: [-10, -12],
  },
  {
    top: "35%",
    left: "90%",
    size: 2,
    duration: 9,
    delay: 2.8,
    color: "primary",
    drift: [8, -16],
  },
  {
    top: "90%",
    left: "20%",
    size: 3,
    duration: 10,
    delay: 1.1,
    color: "accent",
    drift: [-12, -10],
  },
] as const;

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="hexa-grid"
            width="56"
            height="97"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <path
              d="M28 0 56 16 56 48 28 64 0 48 0 16Z"
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth="1"
            />
            <path
              d="M28 64 56 80 56 112 28 128 0 112 0 80Z"
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexa-grid)" />
      </svg>

      <div
        className="animate-hexa-pulse absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 35%, transparent) 0%, color-mix(in oklab, var(--color-accent) 15%, transparent) 45%, transparent 75%)",
        }}
      />

      <div className="motion-reduce:hidden">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="animate-hexa-float absolute rounded-full"
            style={
              {
                top: particle.top,
                left: particle.left,
                width: particle.size * 4,
                height: particle.size * 4,
                background:
                  particle.color === "primary"
                    ? "var(--color-primary)"
                    : "var(--color-accent)",
                boxShadow: `0 0 ${particle.size * 6}px ${particle.size}px ${
                  particle.color === "primary"
                    ? "var(--color-primary)"
                    : "var(--color-accent)"
                }`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-drift-x": `${particle.drift[0]}px`,
                "--particle-drift-y": `${particle.drift[1]}px`,
                "--particle-opacity": 0.7,
                animationDelay: `${particle.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
