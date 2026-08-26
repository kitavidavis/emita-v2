export type AuthScreen = "signin" | "twofa" | "forgot" | "sent" | "reset" | "invite" | "enrol" | "locked" | "support";

export const BRAND_COPY: Record<AuthScreen, { kicker: string; title: string; body: string }> = {
  signin: {
    kicker: "Utility intelligence",
    title: "One console for the whole utility.",
    body: "Customers, metering, billing and network intelligence in a single record — from the intake point to the invoice.",
  },
  twofa: {
    kicker: "Account security",
    title: "Two steps, because the data is customer data.",
    body: "Billing records, meter reads and customer details sit behind this login. A second factor keeps them there.",
  },
  forgot: {
    kicker: "Account recovery",
    title: "Get back to your console.",
    body: "Reset links are issued to registered addresses only, work once, and expire after an hour.",
  },
  sent: {
    kicker: "Account recovery",
    title: "Check your inbox.",
    body: "Reset links are issued to registered addresses only, work once, and expire after an hour.",
  },
  reset: {
    kicker: "Account recovery",
    title: "Choose something you will keep.",
    body: "A strong password protects the customer register, the billing run and the audit trail behind it.",
  },
  invite: {
    kicker: "Welcome to Emita",
    title: "You have been invited to a utility.",
    body: "Your administrator has set your role. What you can see and change follows from it.",
  },
  enrol: {
    kicker: "Account security",
    title: "Add your second factor.",
    body: "Codes take a few seconds and stop a stolen password from becoming a stolen billing register.",
  },
  locked: {
    kicker: "Account security",
    title: "Locked, on purpose.",
    body: "Repeated failed attempts pause the account. It reopens automatically, or your administrator can release it.",
  },
  support: {
    kicker: "Access help",
    title: "Someone can unblock you today.",
    body: "Your utility administrator can reset passwords and reissue invitations without waiting for Emita.",
  },
};

export type MfaOption = {
  key: string;
  name: string;
  note: string;
  tag: string;
  recommended: boolean;
  icon: string;
};

export const mfaOptions: MfaOption[] = [
  {
    key: "app",
    name: "Authenticator app",
    note: "Codes from Google Authenticator, Authy or similar. Works without network coverage.",
    tag: "RECOMMENDED",
    recommended: true,
    icon: "M4 1.5h8v13H4zM6.5 12h3",
  },
  {
    key: "sms",
    name: "SMS to your phone",
    note: "A six-digit code sent to the number on your staff record.",
    tag: "",
    recommended: false,
    icon: "M2 4h12v8H2zM5 14h6",
  },
  {
    key: "recovery",
    name: "Recovery codes only",
    note: "Ten single-use codes to print and store. Use where phones are shared.",
    tag: "",
    recommended: false,
    icon: "M3 2h10v12H3zM6 5.5h4M6 8h4M6 10.5h2",
  },
];

export const lockAttempts = [
  { when: "09:41 today", where: "Nairobi, KE · Chrome on Windows" },
  { when: "09:40 today", where: "Nairobi, KE · Chrome on Windows" },
  { when: "09:38 today", where: "Unknown location · Firefox" },
];

export const helpRoutes = [
  {
    name: "Ask your utility administrator",
    note: "Nelly Wanjala manages accounts for Bwaliro Water and can reset your password in a minute.",
    action: "n.wanjala@bwaliro.co.ke",
  },
  {
    name: "Invitation expired",
    note: "Invitations lapse after fourteen days. Your administrator can send a fresh one.",
    action: "Request a new invitation →",
  },
  {
    name: "Lost your second factor",
    note: "If you cannot reach your phone or recovery codes, Emita support can verify you another way.",
    action: "Start an identity check →",
  },
];

export const inviteDetails = {
  inviterName: "Nelly Wanjala",
  utility: "Bwaliro Water Project",
  region: "Malanga Elugulu",
  email: "g.atieno@bwaliro.co.ke",
  role: "Billing clerk",
  expires: "2 September 2026",
};

export const resetTargetEmail = "n.wanjala@bwaliro.co.ke";

// Demo-only stand-ins for a real auth backend. There is no server here, so
// sign-in and 2FA are checked against these fixed values instead.
export const demoAccount = {
  email: "n.wanjala@bwaliro.co.ke",
  password: "Bwaliro@2026",
};

export const demoOtp = "482913";
