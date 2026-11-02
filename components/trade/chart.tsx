"use client";
import { useState } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { Card, Tabs, TokenLogo } from "@/components/shared/ui";
import { MarketCapChart } from "./market-cap-chart";
const path = [
  0.01365, 0.0135, 0.0134, 0.0133, 0.0132, 0.01326, 0.01335, 0.01328, 0.01312,
  0.01305, 0.01294, 0.013, 0.01304, 0.01296, 0.01273, 0.01278, 0.01283, 0.0128,
  0.01276, 0.01274, 0.01283, 0.01289, 0.01285, 0.01279, 0.01263, 0.01255,
  0.01265, 0.01245, 0.01251, 0.0124, 0.01219, 0.01223, 0.01229, 0.01216,
  0.01206, 0.01211, 0.01202, 0.01196, 0.01183, 0.0119, 0.01188, 0.01197,
  0.01205, 0.01212, 0.01206, 0.01201, 0.01189, 0.01181, 0.01196, 0.01212,
  0.01204, 0.01209, 0.01222, 0.0123, 0.01235, 0.01242, 0.0125, 0.01258, 0.01251,
  0.0125,
];
export function Chart({
  protect,
  amount,
  floor,
}: {
  protect: boolean;
  amount: number;
  floor: number | null;
}) {
  const [time, setTime] = useState("1H");
  const [market, setMarket] = useState("CKB/USDC");
  const isMarketCap = market === "CKB";
  const y = (p: number) => (0.014 - p) * 160000;
  const shift =
    time === "15m"
      ? -0.00008
      : time === "4H"
        ? 0.00008
        : time === "1D"
          ? 0.00015
          : time === "1W"
            ? -0.00015
            : 0;
  return (
    <Card className={`chart-card ${protect ? "protect-chart" : ""}`}>
      <div className="chart-heading">
        <div>
          <div className="pair-heading">
            <TokenLogo token="CKB" />
            {!isMarketCap && <TokenLogo token="USDC" />}
            <select
              className="market-select"
              aria-label="Chart market"
              value={market}
              onChange={(event) => {
                setMarket(event.target.value);
                setTime(event.target.value === "CKB" ? "1D" : "1H");
              }}
            >
              <option value="CKB/USDC">CKB/USDC</option>
              <option value="CKB">CKB</option>
            </select>
          </div>
          {isMarketCap && <p className="market-context">Market cap · USD</p>}
          <div className="market-price">
            {isMarketCap ? "$57.91M" : protect ? "0.01250" : "$0.01250"}
            {!isMarketCap && protect && (
              <span className="price-unit"> USDC</span>
            )}{" "}
            <span className="market-change">
              {isMarketCap ? "−5.26%" : "−2.34%"}
            </span>
          </div>
        </div>
        <Tabs
          value={time}
          onChange={setTime}
          label="Chart timeframe"
          options={["15m", "1H", "4H", "1D", "1W"].map((t) => ({
            value: t,
            label: t,
          }))}
        />
      </div>
      {isMarketCap ? (
        <MarketCapChart timeframe={time} />
      ) : (
        <div className="chart-plot">
          <svg
            viewBox="0 0 940 490"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Illustrative CKB/USDC ${time} candlestick chart. Current price 0.01250 USDC. Demo data only.`}
          >
            <defs>
              <linearGradient id="chartShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10e7a2" stopOpacity=".015" />
                <stop offset="1" stopColor="#10e7a2" stopOpacity=".035" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="860"
              height="450"
              fill="url(#chartShade)"
            />
            {[0.014, 0.0135, 0.013, 0.0125, 0.012, 0.0115].map((p) => (
              <g key={p}>
                <line
                  x1="0"
                  x2="860"
                  y1={y(p)}
                  y2={y(p)}
                  className="grid-line"
                />
                <text x="870" y={y(p) + 5}>
                  {p.toFixed(4)}
                </text>
              </g>
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={i}
                x1={25 + i * 100}
                x2={25 + i * 100}
                y1="15"
                y2="450"
                className="grid-line"
              />
            ))}
            {path.map((price, i) => {
              const prev = i ? path[i - 1] : price - 0.0001;
              const close = price + (i === path.length - 1 ? 0 : shift);
              const open = prev + shift;
              const green = close >= open;
              const x = 5 + i * 14.1;
              return (
                <g
                  key={i}
                  fill={green ? "#13efaa" : "#f25759"}
                  stroke={green ? "#13efaa" : "#f25759"}
                >
                  <line
                    x1={x + 4.5}
                    x2={x + 4.5}
                    y1={y(Math.max(open, close) + 0.00006 + (i % 3) * 0.00003)}
                    y2={y(Math.min(open, close) - 0.00008)}
                  />
                  <rect
                    x={x}
                    y={Math.min(y(open), y(close))}
                    width="9"
                    height={Math.max(2, Math.abs(y(open) - y(close)))}
                  />
                  <rect
                    x={x}
                    y={450 - (12 + ((i * 17) % 32))}
                    width="9"
                    height={12 + ((i * 17) % 32)}
                    opacity=".32"
                    stroke="none"
                  />
                </g>
              );
            })}
            <line
              x1="0"
              x2="862"
              y1={y(0.0125)}
              y2={y(0.0125)}
              stroke="#13efaa"
              strokeDasharray="3 2"
            />
            <rect
              x="861"
              y={y(0.0125) - 13}
              width="74"
              height="26"
              rx="4"
              fill="#13efaa"
            />
            <text
              x="898"
              y={y(0.0125) + 5}
              textAnchor="middle"
              className="price-label"
            >
              0.01250
            </text>
            {protect && floor !== null && (
              <g>
                <line
                  x1="0"
                  x2="860"
                  y1={Math.max(25, Math.min(414, y(floor)))}
                  y2={Math.max(25, Math.min(414, y(floor)))}
                  stroke="#ffc12c"
                  strokeDasharray="7 3"
                />
                <rect
                  x="690"
                  y={Math.max(25, Math.min(414, y(floor))) - 13}
                  width="245"
                  height="26"
                  rx="4"
                  fill="#ffc12c"
                />
                <text
                  x="812"
                  y={Math.max(25, Math.min(414, y(floor))) + 5}
                  textAnchor="middle"
                  className="price-label"
                >
                  Safety floor · {floor.toFixed(5)}
                </text>
              </g>
            )}
            <line x1="860" x2="860" y1="14" y2="450" stroke="#42554a" />
            {[
              "Oct 25",
              "06:00",
              "12:00",
              "18:00",
              "Oct 26",
              "06:00",
              "12:00",
              "18:00",
            ].map((t, i) => (
              <text
                className={`time-axis time-${i}`}
                key={i}
                x={14 + i * 105}
                y="477"
              >
                {t}
              </text>
            ))}
          </svg>
          <div className="mobile-chart-labels" aria-hidden="true">
            {[0.014, 0.0135, 0.013, 0.012, 0.0115].map((p) => (
              <span
                className="mobile-axis-price"
                key={p}
                style={{ top: `${(y(p) / 490) * 100}%` }}
              >
                {p.toFixed(4)}
              </span>
            ))}
            <span
              className="mobile-current-price"
              style={{ top: `${(y(0.0125) / 490) * 100}%` }}
            >
              0.01250
            </span>
            {protect && floor !== null && (
              <span
                className="mobile-floor-price"
                style={{
                  top: `${(Math.max(25, Math.min(414, y(floor))) / 490) * 100}%`,
                }}
              >
                Floor · {floor.toFixed(5)}
              </span>
            )}
            <div className="mobile-time-axis">
              {[
                "Oct 25",
                "06:00",
                "12:00",
                "18:00",
                "Oct 26",
                "06:00",
                "12:00",
                "18:00",
              ].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="chart-caption">
        <span>
          {isMarketCap
            ? "Market cap reference · CKB · USD"
            : "Market reference · CKB/USDC"}
        </span>
        <span>Demo market data</span>
      </div>
      {protect && (
        <div className="protection-summary">
          <Shield className="warning" size={28} />
          <strong>Protect {amount.toLocaleString()} CKB</strong>
          <ArrowRight size={22} />
          <TokenLogo token="USDC" />
          <span>Receive USDC when your rule triggers</span>
        </div>
      )}
    </Card>
  );
}
