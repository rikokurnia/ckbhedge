import test from "node:test";
import assert from "node:assert/strict";
import {
  isChannelData,
  isChannelHistory,
  readStoredDemo,
} from "../lib/channel-storage.ts";
import {
  INITIAL_CHANNEL_DATA,
  INITIAL_CHANNEL_HISTORY,
} from "../components/channels/types.ts";

const storage = (raw) => ({ getItem: () => raw });
test("restores valid channel and history snapshots, including an empty history", () => {
  assert.deepEqual(
    readStoredDemo(
      storage(JSON.stringify(INITIAL_CHANNEL_DATA)),
      "channel",
      isChannelData,
    ),
    INITIAL_CHANNEL_DATA,
  );
  assert.deepEqual(
    readStoredDemo(
      storage(JSON.stringify(INITIAL_CHANNEL_HISTORY)),
      "history",
      isChannelHistory,
    ),
    INITIAL_CHANNEL_HISTORY,
  );
  assert.deepEqual(
    readStoredDemo(storage("[]"), "history", isChannelHistory),
    [],
  );
});
test("rejects missing, corrupt and obsolete channel data without throwing", () => {
  for (const raw of [
    null,
    "null",
    "{}",
    "[]",
    '"hello"',
    "{broken",
    '{"state":"active"}',
  ]) {
    assert.equal(readStoredDemo(storage(raw), "channel", isChannelData), null);
  }
  for (const patch of [
    { localCapacity: -1 },
    { remoteCapacity: "2500" },
    { peerNodeId: null },
    { state: "unknown" },
    { network: "mainnet" },
  ]) {
    assert.equal(isChannelData({ ...INITIAL_CHANNEL_DATA, ...patch }), false);
  }
  assert.equal(
    isChannelData({ ...INITIAL_CHANNEL_DATA, localCapacity: Infinity }),
    false,
  );
});
test("rejects malformed histories and entries before rendering", () => {
  for (const raw of [
    "null",
    "{}",
    "[null]",
    "[{}]",
    JSON.stringify([{ ...INITIAL_CHANNEL_HISTORY[0], amountCkb: -1 }]),
  ]) {
    assert.equal(
      readStoredDemo(storage(raw), "history", isChannelHistory),
      null,
    );
  }
});
test("handles unavailable or blocked browser storage", () => {
  assert.equal(
    readStoredDemo(
      {
        getItem() {
          throw new Error("Storage blocked");
        },
      },
      "channel",
      isChannelData,
    ),
    null,
  );
});
