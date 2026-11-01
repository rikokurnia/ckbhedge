"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronDown,
  Shield,
  CircleAlert,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button, Card, Dialog, Tabs, TokenRow } from "@/components/shared/ui";
import {
  DEMO_RATE,
  channel,
  formatAmount,
  type TokenSymbol,
  type ProtectionRule,
  type Activity,
} from "@/lib/demo";
import { Chart } from "./chart";
export function Terminal() {
  const [tab, setTab] = useState("swap");
  const [mode, setMode] = useState("auto");
  const [from, setFrom] = useState<TokenSymbol>("CKB");
  const to = from === "CKB" ? "USDC" : "CKB";
  const [amount, setAmount] = useState("10,000");
  const [funds, setFunds] = useState({ CKB: 50000, USDC: 250 });
  const [percent, setPercent] = useState(50);
  const [floor, setFloor] = useState("0.01150");
  const [kind, setKind] = useState("stop-loss");
  const [trailing, setTrailing] = useState("3");
  const [execution, setExecution] = useState("notify");
  const [limit, setLimit] = useState("25000");
  const [expiry, setExpiry] = useState("24");
  const [slippage, setSlippage] = useState("0.5");
  const [advanced, setAdvanced] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [done, setDone] = useState(false);
  const [events, setEvents] = useState<Activity[]>([]);
  const [rules, setRules] = useState<ProtectionRule[]>([]);
  const protect = tab === "protect";
  const hedge = Math.round((funds.CKB * percent) / 100);
  const numeric = Number(amount.replaceAll(",", ""));
  const receive = from === "CKB" ? numeric * DEMO_RATE : numeric / DEMO_RATE;
  const floorNumber = Number(floor);
  const automatic = execution === "automatic";
  const validSwap =
    Number.isFinite(numeric) &&
    numeric > 0 &&
    numeric <= funds[from] &&
    (from !== "CKB" || receive <= channel.remoteCapacity);
  const validProtect =
    hedge > 0 &&
    (mode === "manual" ||
      ((kind !== "stop-loss" || (floorNumber > 0 && floorNumber < 0.0125)) &&
        (kind !== "trailing-stop" ||
          (Number(trailing) > 0 && Number(trailing) < 100)) &&
        (!automatic ||
          (Number(limit) >= hedge && Number(limit) <= funds.CKB))));
  function review() {
    setDone(false);
    setDialog(true);
  }
  function confirm() {
    if (!protect || mode === "manual") {
      const sold = protect ? hedge : numeric;
      const source = protect ? "CKB" : from;
      const target = source === "CKB" ? "USDC" : "CKB";
      const received = source === "CKB" ? sold * DEMO_RATE : sold / DEMO_RATE;
      setFunds((f) => ({
        ...f,
        [source]: f[source] - sold,
        [target]: f[target] + received,
      }));
      setEvents((e) => [
        {
          id: `demo-${Date.now()}`,
          type: protect ? "protection" : "swap",
          timestamp: new Date().toISOString(),
          from: source,
          to: target,
          amount: sold,
          received,
          status: "completed",
          demo: true,
        },
        ...e,
      ]);
    } else {
      setRules((r) => [
        ...r,
        {
          id: `rule-${Date.now()}`,
          type: kind as ProtectionRule["type"],
          amount: hedge,
          triggerPrice: floorNumber,
          trailingPercent: Number(trailing),
          execution: execution as ProtectionRule["execution"],
          spendingLimit: Number(limit),
          expiresAt: new Date(
            Date.now() + Number(expiry) * 3600000,
          ).toISOString(),
          status: "active",
          demo: true,
        },
      ]);
    }
    setDone(true);
  }
  return (
    <>
      <div className="trade-grid">
        <Chart
          protect={protect}
          amount={hedge}
          floor={
            mode === "manual" || kind === "ai-signal"
              ? null
              : kind === "trailing-stop"
                ? 0.0125 * (1 - Number(trailing) / 100)
                : Number.isFinite(floorNumber)
                  ? floorNumber
                  : 0.0115
          }
        />
        <Card className={`trade-panel ${protect ? "is-protect" : ""}`}>
          <Tabs
            label="Trade mode"
            value={tab}
            onChange={setTab}
            options={[
              { value: "swap", label: "Swap" },
              {
                value: "protect",
                label: (
                  <>
                    <Shield size={20} />
                    Protect
                  </>
                ),
              },
            ]}
          />
          <div className="panel-title">
            <h1>{protect ? "Protect your CKB" : "Instant swap"}</h1>
            <p className="muted">
              {protect
                ? "Set a rule to swap CKB into USDC"
                : "CKB ↔ USDC on Fiber"}
            </p>
          </div>
          {!protect ? (
            <>
              <div className="amount-box">
                <div className="field-label">
                  <label htmlFor="sell">Sell</label>
                  <span>
                    Channel balance:{" "}
                    {formatAmount(funds[from], from === "CKB" ? 0 : 2)} {from}
                  </span>
                </div>
                <div className="amount-line">
                  <input
                    id="sell"
                    autoComplete="off"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      if (/^[\d,.]*$/.test(e.target.value))
                        setAmount(e.target.value);
                    }}
                    onFocus={() => setAdvanced(true)}
                    aria-invalid={!validSwap}
                  />
                  <span className="token-pill">
                    <TokenRow token={from} />
                  </span>
                </div>
              </div>
              <div className="reverse-wrap">
                <button
                  className="reverse"
                  aria-label="Reverse swap direction"
                  onClick={() => {
                    setFrom(to);
                    setAmount(to === "USDC" ? "125" : "10000");
                  }}
                >
                  <ArrowDownUp size={23} />
                </button>
              </div>
              <div className="amount-box receive-box">
                <div className="field-label">
                  <span>Receive</span>
                  <span>Estimated receive</span>
                </div>
                <div className="amount-line">
                  <output>
                    {Number.isFinite(receive)
                      ? formatAmount(receive, to === "USDC" ? 2 : 2)
                      : "0.00"}
                  </output>
                  <span className="token-pill">
                    <TokenRow token={to} />
                  </span>
                </div>
              </div>
              {advanced && (
                <div className="percent-controls">
                  {[25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      onClick={() => setAmount(String((funds[from] * p) / 100))}
                    >
                      {p === 100 ? "Max" : `${p}%`}
                    </button>
                  ))}
                </div>
              )}
              <div className="quote-info">
                <p className="quote-rate">
                  1 {from} = {from === "CKB" ? "0.01248" : "80.12821"} {to}{" "}
                  <small>Demo quote</small>
                </p>
                <label className="slippage">
                  Slippage tolerance:{" "}
                  <select
                    aria-label="Slippage tolerance"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                  >
                    {["0.1", "0.5", "1"].map((v) => (
                      <option key={v} value={v}>
                        {v}%
                      </option>
                    ))}
                  </select>
                </label>
                <p>L1 gas per channel swap: 0 CKB</p>
                <p>LP fee: Included</p>
                <p>Illustrative quote · refreshed at review</p>
              </div>
              {!validSwap && (
                <p className="error-text">
                  {numeric > funds[from]
                    ? "Amount exceeds your demo channel balance."
                    : "Enter an amount within available channel liquidity."}
                </p>
              )}
              <Button
                data-review
                disabled={!validSwap}
                className="review-button"
                onClick={review}
              >
                Review swap
              </Button>
            </>
          ) : (
            <>
              <Tabs
                className="protection-modes"
                label="Protection method"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "manual", label: "Manual" },
                  { value: "auto", label: "Auto" },
                ]}
              />
              <div className="amount-box protection-amount">
                <div className="field-label">
                  <label htmlFor="hedge-range">Amount to protect</label>
                  <span>Channel balance: {formatAmount(funds.CKB)} CKB</span>
                </div>
                <div className="amount-line">
                  <output>{formatAmount(hedge)}</output>
                  <span className="token-pill">
                    <TokenRow token="CKB" />
                  </span>
                </div>
              </div>
              <input
                className="hedge-range"
                id="hedge-range"
                type="range"
                min="1"
                max="100"
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--warning) ${percent}%, #22372d ${percent}%)`,
                }}
              />
              <div className="percent-controls warning-controls">
                {[25, 50, 75, 100].map((p) => (
                  <button
                    key={p}
                    aria-pressed={percent === p}
                    onClick={() => setPercent(p)}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              {mode === "auto" ? (
                <>
                  {kind === "stop-loss" ? (
                    <div className="amount-box floor-box">
                      <label htmlFor="floor">Safety floor</label>
                      <div className="amount-line">
                        <input
                          id="floor"
                          inputMode="decimal"
                          autoComplete="off"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                        />
                        <span className="token-pill small">
                          <TokenRow token="USDC">USDC / CKB</TokenRow>
                        </span>
                      </div>
                      <p className="muted">
                        {Number.isFinite(floorNumber)
                          ? Math.round((1 - floorNumber / 0.0125) * 100)
                          : "—"}
                        % below current price
                      </p>
                    </div>
                  ) : kind === "trailing-stop" ? (
                    <label className="setting-field">
                      Drop from local peak (%)
                      <input
                        inputMode="decimal"
                        value={trailing}
                        onChange={(e) => setTrailing(e.target.value)}
                      />
                      <span className="muted">Demo peak: 0.01250 USDC</span>
                    </label>
                  ) : (
                    <div className="signal-note">
                      <Zap size={20} />
                      <div>
                        Volatility & momentum signal
                        <p className="muted">
                          Simulated signal only. No AI model is connected.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="rule-details">
                    <div>
                      <span>Action</span>
                      <span>Swap CKB → USDC</span>
                    </div>
                    <div>
                      <span>Trigger</span>
                      <span>
                        {kind === "stop-loss"
                          ? `CKB price ≤ ${floor} USDC`
                          : kind === "trailing-stop"
                            ? `${trailing}% below local peak`
                            : "Demo volatility signal"}
                      </span>
                    </div>
                    <div>
                      <span>Slippage tolerance</span>
                      <span>0.5%</span>
                    </div>
                  </div>
                  <details className="execution-settings">
                    <summary>
                      Execution & authorization <ChevronDown size={16} />
                    </summary>
                    <div className="rule-select">
                      <label htmlFor="rule-kind">Protection rule</label>
                      <select
                        id="rule-kind"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                      >
                        <option value="stop-loss">Stop-loss</option>
                        <option value="trailing-stop">Trailing Stop</option>
                        <option value="ai-signal">AI Signal</option>
                      </select>
                    </div>
                    <Tabs
                      label="Execution policy"
                      value={execution}
                      onChange={setExecution}
                      options={[
                        { value: "notify", label: "Notify me" },
                        { value: "automatic", label: "Automatic" },
                      ]}
                    />
                    <p className="muted">
                      {automatic
                        ? "Authorize a limited demo session to simulate automatic execution."
                        : "Save a demo alert. You review the swap when triggered."}
                    </p>
                    {automatic && (
                      <div className="session-fields">
                        <label className="setting-field">
                          Spending limit (CKB)
                          <input
                            inputMode="decimal"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                          />
                        </label>
                        <label className="setting-field">
                          Session expiry
                          <select
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                          >
                            <option value="1">1 hour</option>
                            <option value="6">6 hours</option>
                            <option value="24">24 hours</option>
                          </select>
                        </label>
                      </div>
                    )}
                  </details>
                </>
              ) : (
                <div className="rule-details manual-note">
                  <Shield size={24} />
                  <p>
                    Swap {formatAmount(hedge)} CKB into approximately{" "}
                    {formatAmount(hedge * DEMO_RATE, 2)} USDC now.
                    <span className="muted">
                      {" "}
                      Review and confirm this manual demo hedge.
                    </span>
                  </p>
                </div>
              )}
              <p className="liquidity-warning">
                <CircleAlert size={17} />
                {mode === "auto"
                  ? "Execution depends on channel liquidity."
                  : "Manual hedge uses an illustrative demo quote."}
              </p>
              {!validProtect && (
                <p className="error-text">
                  Check your trigger, balance, and spending limit. The limit
                  must cover this hedge.
                </p>
              )}
              <Button
                data-review
                className="review-button"
                disabled={!validProtect}
                onClick={review}
              >
                {mode === "manual"
                  ? "Review manual hedge"
                  : "Review protection"}
              </Button>
            </>
          )}
          <div className="channel-status">
            <span>
              <i className="status-dot" />
              Fiber channel active
            </span>
            <span>Available USDC liquidity: 2,500</span>
          </div>
        </Card>
      </div>
      <Card className="channel-strip">
        <strong>Your channel</strong>
        <span className="strip-divider" />
        <TokenRow token="CKB">{formatAmount(funds.CKB)} CKB</TokenRow>
        <span className="strip-divider" />
        <TokenRow token="USDC">{formatAmount(funds.USDC, 2)} USDC</TokenRow>
        <Link className="button channel-link" href="/channels">
          Manage channel <ArrowUpRight size={20} />
        </Link>
      </Card>
      {(rules.length > 0 || events.length > 0) && (
        <Card className="demo-results" aria-live="polite">
          {rules.map((r) => (
            <div className="balance-row" key={r.id}>
              <span>
                <Shield size={16} /> {r.type} · {formatAmount(r.amount)} CKB
              </span>
              <span className="muted">
                Demo{" "}
                {r.execution === "notify"
                  ? "alert saved"
                  : "session authorized"}{" "}
                <button
                  className="text-button"
                  onClick={() =>
                    setRules((all) => all.filter((x) => x.id !== r.id))
                  }
                >
                  Remove
                </button>
              </span>
            </div>
          ))}
          {events.slice(0, 3).map((e) => (
            <div className="balance-row" key={e.id}>
              <span>Demo {e.type} completed</span>
              <span>
                {formatAmount(e.amount, 2)} {e.from} →{" "}
                {formatAmount(e.received, 2)} {e.to}
              </span>
            </div>
          ))}
        </Card>
      )}
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title={
          done
            ? "Demo completed"
            : !protect
              ? "Review demo swap"
              : mode === "manual"
                ? "Confirm manual demo hedge"
                : automatic
                  ? "Authorize demo protection"
                  : "Review demo protection"
        }
      >
        {done ? (
          <>
            <CheckCircle2 className="success-icon" size={44} />
            <p>
              {protect && mode === "auto"
                ? "Your demo protection rule has been saved. No background watcher or real authorization is active."
                : "Your simulated swap is complete. Demo balances have been updated."}
            </p>
            <Button onClick={() => setDialog(false)}>Done</Button>
          </>
        ) : (
          <>
            <div className="balance-row">
              <span>{protect ? "Protect" : "Sell"}</span>
              <strong>
                {formatAmount(protect ? hedge : numeric, 2)}{" "}
                {protect ? "CKB" : from}
              </strong>
            </div>
            <div className="balance-row">
              <span>
                {protect && mode === "auto" ? "Execution" : "Estimated receive"}
              </span>
              <strong>
                {protect && mode === "auto"
                  ? automatic
                    ? "Automatic · demo"
                    : "Notification only"
                  : `${formatAmount(protect ? hedge * DEMO_RATE : receive, 2)} ${protect ? "USDC" : to}`}
              </strong>
            </div>
            {protect && mode === "auto" && (
              <>
                <p>
                  Trigger:{" "}
                  {kind === "stop-loss"
                    ? `CKB ≤ ${floor} USDC`
                    : kind === "trailing-stop"
                      ? `${trailing}% below peak`
                      : "Simulated AI signal"}
                  .
                </p>
                {automatic && (
                  <p>
                    Session limit: {formatAmount(Number(limit))} CKB · Expires
                    in {expiry} hours. This does not create a key or grant
                    wallet access.
                  </p>
                )}
              </>
            )}
            <p className="muted">
              Illustrative quote. USDC is an unverified demo asset. No real
              transaction will be submitted.
            </p>
            <Button onClick={confirm}>
              {protect && mode === "auto"
                ? automatic
                  ? "Authorize demo session"
                  : "Save demo alert"
                : "Confirm demo swap"}
            </Button>
            <Button variant="ghost" onClick={() => setDialog(false)}>
              Cancel
            </Button>
          </>
        )}
      </Dialog>
    </>
  );
}
