"use client";

// Illustrative capitalization values in USD millions, not a live CRYPTOCAP feed.
const marketCaps = [
  47, 46, 44, 45, 44, 43, 44, 45, 44, 46, 43, 44, 42, 41, 40, 40.8, 40.2, 41,
  42.5, 41.8, 40.7, 40.9, 41.5, 40.2, 44, 49, 48, 51, 50, 49, 52, 51, 54, 57,
  59, 56, 58, 53, 54, 60, 62, 59, 56, 57, 64, 67, 65, 71, 73, 72, 66, 65, 66,
  65, 66, 68, 65, 62, 60, 69, 96, 74, 79, 77, 75, 76, 73, 72, 78, 75, 70, 68,
  69, 67, 61, 62, 61, 57.91,
];

export function MarketCapChart({ timeframe }: { timeframe: string }) {
  const y = (value: number) => 420 - ((value - 40) / 60) * 400;
  const points = marketCaps
    .map((value, index) => {
      const variation =
        timeframe === "1D" || index === marketCaps.length - 1
          ? 0
          : Math.sin(index * 0.7) * (timeframe === "1W" ? 2 : 1);
      return `${6 + (index / (marketCaps.length - 1)) * 850},${y(value + variation)}`;
    })
    .join(" ");
  const timeLabels =
    timeframe === "1D"
      ? ["Aug", "Sep", "Oct", "Nov"]
      : timeframe === "1W"
        ? ["Apr", "Jun", "Aug", "Nov"]
        : timeframe === "4H"
          ? ["Oct 21", "Oct 25", "Oct 30", "Nov 3"]
          : timeframe === "1H"
            ? ["Nov 1", "12:00", "Nov 2", "Nov 3"]
            : ["00:00", "06:00", "12:00", "18:00"];
  return (
    <div className="chart-plot market-cap-plot">
      <svg
        viewBox="0 0 940 490"
        preserveAspectRatio="none"
        role="img"
        aria-label={`CKB market capitalization in USD, ${timeframe}. Reference line chart, ending at 57.91 million dollars. Not live market data.`}
      >
        <defs>
          <linearGradient id="marketCapArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5284ff" stopOpacity=".32" />
            <stop offset="1" stopColor="#5284ff" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[100, 90, 80, 70, 60, 50, 40].map((value) => (
          <line
            key={value}
            x1="0"
            x2="860"
            y1={y(value)}
            y2={y(value)}
            className="grid-line"
          />
        ))}
        {Array.from({ length: 9 }, (_, index) => (
          <line
            key={index}
            x1={index * 107}
            x2={index * 107}
            y1="15"
            y2="450"
            className="grid-line"
          />
        ))}
        <polygon
          points={`6,450 ${points} 856,450`}
          fill="url(#marketCapArea)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#5284ff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        {marketCaps.map((value, index) => (
          <rect
            key={index}
            x={6 + (index / (marketCaps.length - 1)) * 850}
            y={450 - (index === 60 ? 43 : 4 + ((index * 11) % 15))}
            width="7"
            height={index === 60 ? 43 : 4 + ((index * 11) % 15)}
            fill={
              index && value < marketCaps[index - 1] ? "#f25759" : "#13efaa"
            }
            opacity=".3"
          />
        ))}
        <line
          x1="0"
          x2="860"
          y1={y(57.91)}
          y2={y(57.91)}
          stroke="#5284ff"
          strokeDasharray="3 3"
        />
        <line x1="860" x2="860" y1="15" y2="450" stroke="#42554a" />
      </svg>
      <div className="mobile-chart-labels" aria-hidden="true">
        {[100, 90, 80, 70, 60, 50, 40].map((value) => (
          <span
            key={value}
            className="mobile-axis-price"
            style={{ top: `${(y(value) / 490) * 100}%` }}
          >
            {value}M
          </span>
        ))}
        <span
          className="mobile-current-price market-cap-current"
          style={{ top: `${(y(57.91) / 490) * 100}%` }}
        >
          57.91M
        </span>
        <div className="mobile-time-axis">
          {timeLabels.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
