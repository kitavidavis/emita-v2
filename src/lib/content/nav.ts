export type MenuLink = {
  title: string;
  body?: string;
  href: string;
};

export const platformMenu = {
  featured: {
    kicker: "The platform",
    title: "One connected intelligence layer for the utility.",
    href: "/platform",
    cta: "Platform overview",
  },
  core: [
    { title: "Emita Intelligence", href: "/platform/intelligence" },
    { title: "Data Platform", href: "/platform" },
    { title: "GIS & Spatial Intelligence", href: "/platform" },
  ] as MenuLink[],
  foundations: [
    { title: "Integrations", href: "/platform" },
    { title: "Security & Architecture", href: "/platform" },
  ] as MenuLink[],
  startHere: [
    { title: "Request a demo", href: "/demo" },
    { title: "See a deployment", href: "/customers" },
  ] as MenuLink[],
};

export const productsMenu: MenuLink[] = [
  { title: "Smart Metering", body: "Connect and monitor metering infrastructure.", href: "/products/smart-metering" },
  { title: "NRW Intelligence", body: "Find the patterns behind operational loss.", href: "/products/nrw-intelligence" },
  { title: "Revenue Intelligence", body: "Protect billed volume end to end.", href: "/products/revenue-intelligence" },
  { title: "Infrastructure Intelligence", body: "Performance and condition of the network.", href: "/products/infrastructure-intelligence" },
  { title: "GIS Intelligence", body: "Operational data in geographic context.", href: "/products/gis-intelligence" },
  { title: "Device Intelligence", body: "Connectivity, health and behaviour of devices.", href: "/products/device-intelligence" },
  { title: "Utility AI", body: "Pattern detection and risk prioritisation.", href: "/platform/intelligence" },
  { title: "Data & Analytics", body: "Dashboards, trends and contextual reporting.", href: "/products/data-analytics" },
];

export const solutionsMenu: MenuLink[] = [
  { title: "Reduce Non-Revenue Water", body: "Narrow the gap between water supplied and water billed.", href: "/solutions/reduce-non-revenue-water" },
  { title: "Improve Revenue Collection", body: "Bill on measured consumption, not estimates.", href: "/solutions/improve-revenue-collection" },
  { title: "Digitize Metering Operations", body: "Move field routines off paper and onto the network.", href: "/solutions/digitize-metering-operations" },
  { title: "Connect Fragmented Systems", body: "One record of the network across billing, GIS and field.", href: "/solutions/connect-fragmented-systems" },
  { title: "Modernize Utility Operations", body: "Run the utility on evidence instead of anecdote.", href: "/solutions/modernize-utility-operations" },
];

export const customersMenu: MenuLink[] = [
  { title: "Customer Stories", body: "How utilities put the platform to work.", href: "/customers" },
  { title: "Case Studies", body: "Deployment detail, system by system.", href: "/customers" },
  { title: "Busia Water PoC", body: "A proof of concept in progress.", href: "/customers" },
];

export const resourcesMenu: MenuLink[] = [
  { title: "Insights", href: "/resources" },
  { title: "Reports", href: "/resources" },
  { title: "Research", href: "/resources" },
  { title: "Webinars", href: "/resources" },
];

export const companyMenu: MenuLink[] = [
  { title: "About", href: "/about" },
  { title: "Leadership", href: "/leadership" },
  { title: "Careers", href: "/careers" },
  { title: "Partners", href: "/partners" },
  { title: "Contact", href: "/demo" },
];

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
