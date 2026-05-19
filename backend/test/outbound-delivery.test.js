process.env.NODE_ENV = "test";
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jea_test";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test_jwt_secret_at_least_32_chars";
process.env.OUTBOUND_RETRY_BACKOFF_BASE_MS = "30000";
process.env.OUTBOUND_DELIVERY_MAX_ATTEMPTS = "5";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  computeRetryBackoffMs,
  isReadyForRetry,
  DELIVERY_STATUS,
} = require("../src/modules/conversations/outbound-delivery.service");

describe("outbound-delivery.service", () => {
  it("computes exponential backoff with cap", () => {
    assert.equal(computeRetryBackoffMs(0), 30000);
    assert.equal(computeRetryBackoffMs(1), 60000);
    assert.ok(computeRetryBackoffMs(10) <= 3_600_000);
  });

  it("isReadyForRetry respects max attempts and backoff window", () => {
    const oldEnough = new Date(Date.now() - 120_000);

    assert.equal(
      isReadyForRetry({
        deliveryStatus: DELIVERY_STATUS.FAILED,
        deliveryAttempts: 1,
        updatedAt: oldEnough,
      }),
      true
    );

    assert.equal(
      isReadyForRetry({
        deliveryStatus: DELIVERY_STATUS.FAILED,
        deliveryAttempts: 5,
        updatedAt: oldEnough,
      }),
      false
    );

    assert.equal(
      isReadyForRetry({
        deliveryStatus: DELIVERY_STATUS.SENT,
        deliveryAttempts: 1,
        updatedAt: oldEnough,
      }),
      false
    );
  });
});
