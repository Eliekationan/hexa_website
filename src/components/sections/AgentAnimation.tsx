const center = { x: 120, y: 70 };
const nodes = [
  { x: 26, y: 24 },
  { x: 214, y: 24 },
  { x: 26, y: 116 },
  { x: 214, y: 116 },
];

export function AgentAnimation() {
  return (
    <svg
      viewBox="0 0 240 140"
      className="h-full w-full"
      aria-hidden="true"
      role="presentation"
    >
      {nodes.map((node, index) => (
        <line
          key={`line-${index}`}
          x1={center.x}
          y1={center.y}
          x2={node.x}
          y2={node.y}
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
        />
      ))}

      {nodes.map((node, index) => (
        <circle
          key={`pulse-${index}`}
          r={3.5}
          fill={index % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)"}
          className="animate-hexa-agent-pulse"
          style={
            {
              offsetPath: `path('M${center.x},${center.y} L${node.x},${node.y}')`,
              "--pulse-duration": `${2.6 + index * 0.4}s`,
              "--pulse-delay": `${index * 0.35}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x}
          cy={node.y}
          r={7}
          fill="var(--color-surface-2)"
          stroke={index % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)"}
          strokeWidth="1.5"
        />
      ))}

      <circle
        cx={center.x}
        cy={center.y}
        r={10}
        fill="var(--color-surface-2)"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
    </svg>
  );
}
