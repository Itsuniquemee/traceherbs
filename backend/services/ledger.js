const crypto = require('crypto');

// Stubbed permissioned-ledger recorder
// In production, integrate Hyperledger Fabric SDK here
async function recordEvent(eventType, payload) {
  const timestamp = new Date();
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ eventType, payload, timestamp }))
    .digest('hex');

  // Simulate a txId
  const txId = `tx_${hash.substring(0, 16)}`;

  // TODO: push to real ledger asynchronously
  return { txId, hash, timestamp };
}

module.exports = {
  recordEvent,
};