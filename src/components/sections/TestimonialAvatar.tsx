const palette = ["var(--color-primary)", "var(--color-accent)"];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 997;
  }
  return hash;
}

interface TestimonialAvatarProps {
  name: string;
  initials: string;
}

export function TestimonialAvatar({ name, initials }: TestimonialAvatarProps) {
  const color = palette[hashString(name) % palette.length];

  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="24" cy="24" r="24" fill={color} opacity="0.18" />
      <circle cx="24" cy="24" r="23" fill="none" stroke={color} strokeWidth="1" />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="16"
        fontWeight="600"
        fontFamily="var(--font-sans), sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
