"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#07100d",
          color: "#f4f7f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: 560, margin: "15vh auto", padding: 24 }}>
          <h1>CKBHedge couldn’t load</h1>
          <p>Please reload the page to try again.</p>
          <a href="/trade" style={{ color: "#16efaa" }}>
            Reload Trade
          </a>
        </main>
      </body>
    </html>
  );
}
