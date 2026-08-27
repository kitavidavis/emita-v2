// Reporting & Analytics' audit_log: one row per event received, from every other service — the
// real replacement for the old ~925-line report crawler that ran on a cron job never actually
// wired into the app. Subjects follow emita.<domain>.<event>.<version>.

export type LogEntry = {
  id: string;
  subject: string;
  payload: Record<string, string>;
  receivedAt: string;
};

export const DOMAINS = ["identity", "registry", "billing", "payments", "metering", "notifications", "network"] as const;

export function domainOf(subject: string) {
  return subject.split(".")[1] ?? "unknown";
}

export const LOG_ENTRIES: LogEntry[] = [
  { id: "e1", subject: "emita.billing.bill.generated.v1", payload: { billId: "b-8841", customerId: "c-181", total: "1,240.00", currency: "KES" }, receivedAt: "26 Aug, 06:04:12" },
  { id: "e2", subject: "emita.payments.payment.received.v1", payload: { paymentId: "p-5521", customerId: "c-181", amount: "1,240.00", currency: "KES" }, receivedAt: "26 Aug, 06:11:40" },
  { id: "e3", subject: "emita.metering.meter.reading.recorded.v1", payload: { readingId: "r-9921", meterId: "MTR-40992", readingValue: "482.100" }, receivedAt: "26 Aug, 06:14:02" },
  { id: "e4", subject: "emita.payments.payment.unmatched.v1", payload: { provider: "mpesa", transactionId: "SFC7X2K91", accountNumberReference: "BW-00O181" }, receivedAt: "26 Aug, 05:58:03" },
  { id: "e5", subject: "emita.registry.customer.status_changed.v1", payload: { customerId: "c-158", oldStatus: "connected", newStatus: "disconnected" }, receivedAt: "26 Aug, 05:40:21" },
  { id: "e6", subject: "emita.metering.supply_reading.recorded.v1", payload: { supplyPointId: "sp-bh1", readingType: "cumulative_volume", readingValue: "1840.000" }, receivedAt: "26 Aug, 06:04:55" },
  { id: "e7", subject: "emita.identity.staff.invited.v1", payload: { staffId: "s-770", email: "f.okoth@bwaliro.co.ke" }, receivedAt: "24 Aug, 14:02:10" },
  { id: "e8", subject: "emita.payments.customer.defaulted.v1", payload: { customerId: "c-158", billingCycleId: "cy-2026-07", fee: "198.00" }, receivedAt: "13 Jul, 06:20:00" },
  { id: "e9", subject: "emita.billing.billing_cycle.completed.v1", payload: { billingCycleId: "cy-2026-07", billCount: "286" }, receivedAt: "12 Jul, 06:09:44" },
  { id: "e10", subject: "emita.notifications.notification.sent.v1", payload: { notificationId: "n-3341", eventType: "bill.generated", channel: "sms" }, receivedAt: "12 Jul, 06:10:02" },
  { id: "e11", subject: "emita.network.asset.condition_changed.v1", payload: { assetId: "a-204", oldCondition: "fair", newCondition: "poor" }, receivedAt: "11 Jul, 09:15:33" },
  { id: "e12", subject: "emita.registry.meter.reassigned.v1", payload: { meterId: "MTR-40403", oldCustomerId: "c-140", newCustomerId: "c-152" }, receivedAt: "9 Jul, 11:02:18" },
];
