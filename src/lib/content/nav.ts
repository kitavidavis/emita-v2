export type MenuLink = {
  title: string;
  body?: string;
  href: string;
};

export type MegaSection = {
  kicker: string;
  links: MenuLink[];
};

export type MegaMenu = {
  intro: {
    kicker: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    links: { label: string; href: string }[];
  };
  sections: MegaSection[];
};

export const platformMenu: MegaMenu = {
  intro: {
    kicker: "The platform",
    title: "One connected intelligence layer for the utility.",
    body: "Infrastructure, operational data and intelligence, connected in one platform.",
    ctaLabel: "Platform overview",
    ctaHref: "/platform",
    links: [
      { label: "Request a demo", href: "/demo" },
      { label: "See a deployment", href: "/customers" },
    ],
  },
  sections: [
    {
      kicker: "Core",
      links: [
        { title: "Emita Intelligence", href: "/platform/intelligence" },
        { title: "Data Platform", href: "/platform" },
        { title: "GIS & Spatial Intelligence", href: "/platform" },
      ],
    },
    {
      kicker: "Foundations",
      links: [
        { title: "Integrations", href: "/platform" },
        { title: "Security & Architecture", href: "/platform" },
      ],
    },
  ],
};

export const productsMenu: MegaMenu = {
  intro: {
    kicker: "Products",
    title: "One suite for every layer of utility intelligence.",
    body: "Every product reads from the same connected data foundation.",
    ctaLabel: "Talk to an expert",
    ctaHref: "/demo",
    links: [
      { label: "See the platform", href: "/platform" },
      { label: "NRW Intelligence", href: "/products/nrw-intelligence" },
    ],
  },
  sections: [
    {
      kicker: "Metering",
      links: [
        { title: "Smart Metering", body: "Connect and monitor metering infrastructure.", href: "/products/smart-metering" },
        { title: "Device Intelligence", body: "Connectivity, health and behaviour of devices.", href: "/products/device-intelligence" },
      ],
    },
    {
      kicker: "Revenue & loss",
      links: [
        { title: "NRW Intelligence", body: "Find the patterns behind operational loss.", href: "/products/nrw-intelligence" },
        { title: "Revenue Intelligence", body: "Protect billed volume end to end.", href: "/products/revenue-intelligence" },
      ],
    },
    {
      kicker: "Network & GIS",
      links: [
        { title: "Infrastructure Intelligence", body: "Performance and condition of the network.", href: "/products/infrastructure-intelligence" },
        { title: "GIS Intelligence", body: "Operational data in geographic context.", href: "/products/gis-intelligence" },
      ],
    },
    {
      kicker: "Intelligence & analytics",
      links: [
        { title: "Utility AI", body: "Pattern detection and risk prioritisation.", href: "/platform/intelligence" },
        { title: "Data & Analytics", body: "Dashboards, trends and contextual reporting.", href: "/products/data-analytics" },
      ],
    },
  ],
};

export const solutionsMenu: MegaMenu = {
  intro: {
    kicker: "Solutions",
    title: "Built around how utilities actually get stuck.",
    body: "Each solution combines the products needed to move past one specific problem.",
    ctaLabel: "Talk to an expert",
    ctaHref: "/demo",
    links: [
      { label: "See a deployment", href: "/customers" },
      { label: "Explore the platform", href: "/platform" },
    ],
  },
  sections: [
    {
      kicker: "By outcome",
      links: [
        { title: "Reduce Non-Revenue Water", body: "Narrow the gap between water supplied and water billed.", href: "/solutions/reduce-non-revenue-water" },
        { title: "Improve Revenue Collection", body: "Bill on measured consumption, not estimates.", href: "/solutions/improve-revenue-collection" },
      ],
    },
    {
      kicker: "By workflow",
      links: [
        { title: "Digitize Metering Operations", body: "Move field routines off paper and onto the network.", href: "/solutions/digitize-metering-operations" },
        { title: "Connect Fragmented Systems", body: "One record of the network across billing, GIS and field.", href: "/solutions/connect-fragmented-systems" },
        { title: "Modernize Utility Operations", body: "Run the utility on evidence instead of anecdote.", href: "/solutions/modernize-utility-operations" },
      ],
    },
  ],
};

export const customersMenu: MegaMenu = {
  intro: {
    kicker: "Customers",
    title: "Utilities putting Emita to work.",
    body: "See how connected data and infrastructure intelligence show up in real operations.",
    ctaLabel: "See the Busia Water PoC",
    ctaHref: "/customers",
    links: [
      { label: "Read the case studies", href: "/customers" },
      { label: "Request a demo", href: "/demo" },
    ],
  },
  sections: [
    {
      kicker: "See it in action",
      links: [
        { title: "Customer Stories", body: "How utilities put the platform to work.", href: "/customers" },
        { title: "Case Studies", body: "Deployment detail, system by system.", href: "/customers" },
        { title: "Busia Water PoC", body: "A proof of concept in progress.", href: "/customers" },
      ],
    },
  ],
};

export const resourcesMenu: MegaMenu = {
  intro: {
    kicker: "Resources",
    title: "Ideas shaping utility operations.",
    body: "Reports, research and insight from the field.",
    ctaLabel: "All resources",
    ctaHref: "/resources",
    links: [
      { label: "The State of Utility Intelligence in Africa", href: "/resources" },
      { label: "Talk to sales", href: "/demo" },
    ],
  },
  sections: [
    {
      kicker: "Read",
      links: [
        { title: "Insights", href: "/resources" },
        { title: "Reports", href: "/resources" },
        { title: "Research", href: "/resources" },
      ],
    },
    {
      kicker: "Watch",
      links: [{ title: "Webinars", href: "/resources" }],
    },
  ],
};

export const companyMenu: MegaMenu = {
  intro: {
    kicker: "Company",
    title: "Building the intelligence layer for utilities.",
    body: "Meet the team and see what we're working on.",
    ctaLabel: "Company overview",
    ctaHref: "/about",
    links: [{ label: "Contact us", href: "/demo" }],
  },
  sections: [
    {
      kicker: "Get to know us",
      links: [
        { title: "About", href: "/about" },
        { title: "Leadership", href: "/leadership" },
      ],
    },
    {
      kicker: "Work with us",
      links: [
        { title: "Careers", href: "/careers" },
        { title: "Partners", href: "/partners" },
      ],
    },
  ],
};

export const footerLinks = {
  platform: [
    { title: "Overview", href: "/platform" },
    { title: "Emita Intelligence", href: "/platform/intelligence" },
    { title: "Data Platform", href: "/platform" },
    { title: "Integrations", href: "/platform" },
  ] as MenuLink[],
  products: [
    { title: "Smart Metering", href: "/products/smart-metering" },
    { title: "NRW Intelligence", href: "/products/nrw-intelligence" },
    { title: "Revenue Intelligence", href: "/products/revenue-intelligence" },
    { title: "Analytics", href: "/products/data-analytics" },
  ] as MenuLink[],
  customers: [
    { title: "Customer Stories", href: "/customers" },
    { title: "Case Studies", href: "/customers" },
    { title: "Busia Water PoC", href: "/customers" },
  ] as MenuLink[],
  company: [
    { title: "About", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Resources", href: "/resources" },
    { title: "Contact", href: "/demo" },
  ] as MenuLink[],
};
