"use client";

import dynamic from "next/dynamic";

const Snowfall = dynamic(
  () => import("react-snowfall").then((mod) => ({ default: mod.Snowfall })),
  {
    ssr: false,
    loading: () => null,
  },
);

interface SnowfallComponentProps {
  enabled?: boolean;
  color?: string;
  snowflakeCount?: number;
  style?: React.CSSProperties;
}

export default function SnowfallComponent({
  enabled = true,
  color = "#000000",
  snowflakeCount = 200,
  style = {},
}: SnowfallComponentProps) {
  if (!enabled) return null;

  return (
    <Snowfall
      color={color}
      snowflakeCount={snowflakeCount}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        ...style,
      }}
    />
  );
}

