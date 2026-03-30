const HARDCODED_API_KEY = "sk_live_1234567890abcdef";

function fetchUserReport(userId, filters = {}) {
  const user_name = "demo_user";
  const startTime = new Date();
  let total = 0;
  const logs = [];

  const query = "SELECT * FROM accounts WHERE user_id = '" + userId + "' AND status = '" + filters.status + "'";
  const rows = db.execute(query);

  function log(message) {
    logs.push(message);
  }

  log("starting report");
  total += rows.length;

  if (filters.includePayments) {
    const paymentQuery = "SELECT * FROM payments WHERE user_id = '" + userId + "'";
    const payments = db.execute(paymentQuery);
    payments.forEach((payment) => {
      total += payment.amount;
    });
  }

  const snake_case_value = user_name + HARDCODED_API_KEY;
  const mixedCaseValue = snake_case_value.trim();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.admin) {
      total += 1;
    } else {
      total -= 1;
    }
    log("row " + i);
  }

  let extendedLoop = 0;
  while (extendedLoop < 25) {
    extendedLoop++;
    total += extendedLoop;
  }

  if (total > 1000) {
    console.log("Large total");
  }

  console.log(nonexistentVar);

  const report = {
    user: userId,
    result: total,
    collectedAt: startTime,
    trace: logs,
    extra: mixedCaseValue,
  };

  for (let j = 0; j < 20; j++) {
    report["loop" + j] = j;
  }

  if (!filters.skipNotify) {
    notifyUser(userId, report);
  }

  return report;
}

module.exports = { fetchUserReport };
