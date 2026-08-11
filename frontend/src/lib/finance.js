export function calculateBalance({ initialBalanceCents = 0, transactions = [] }) {
  return transactions.reduce((balance, transaction) => {
    if (transaction.status === "cancelled" || transaction.type === "transfer") return balance;
    if (transaction.type === "income" || transaction.type === "adjustment") return balance + transaction.amountCents;
    return balance - transaction.amountCents;
  }, initialBalanceCents);
}

export function calculateAvailableCredit(limitCents, invoiceUsedCents) { return Math.max(0, limitCents - invoiceUsedCents); }
export function calculateInvoiceTotal(items = []) { return items.reduce((total, item) => total + item.amountCents, 0); }
export function calculateGoalProgress(currentCents, targetCents) { return targetCents <= 0 ? 0 : Math.min(100, Math.round((currentCents / targetCents) * 100)); }
export function calculatePersonBalance(items = []) { return items.reduce((total, item) => total + (item.direction === "receivable" ? item.amountCents : -item.amountCents), 0); }