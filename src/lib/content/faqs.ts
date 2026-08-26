export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How long does a deployment take?",
    a: "A first zone is typically live within six to eight weeks: connect the metering and billing sources, resolve them against the zone model, then run in parallel with existing reporting until the numbers agree.",
  },
  {
    q: "Do we have to replace our existing meters?",
    a: "No. Emita reads the estate you already have, including manual and paper routes, and improves as more of it becomes connected. Meter replacement is a decision the data should inform, not a prerequisite.",
  },
  {
    q: "Where does our data live?",
    a: "In the region you choose. Emita runs on managed cloud infrastructure or in a private deployment where regulation or procurement requires it.",
  },
  {
    q: "How does Emita fit with our billing system?",
    a: "It sits alongside it. Emita reads the register and writes back exceptions and verified reads through the integration layer — the billing system stays the system of record.",
  },
  {
    q: "What do we need before we start?",
    a: "A source of bulk or district meter readings, your customer register, and someone who can answer questions about how zones are defined. Everything else can follow.",
  },
];
