import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
export default {
  title: "Paycrest",
  tagline: "The P2P-powered crypto-to-cash protocol",
  favicon: "img/favicon.ico",
  url: "https://docs.paycrest.io/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/paycrest/docs/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  themes: ["@docusaurus/theme-live-codeblock"],

  themeConfig: {
    image: "img/paycrest.jpg",
    navbar: {
      // title: "Paycrest Docs",
      logo: {
        alt: "Paycrest Logo",
        src: "https://paycrest.io/assets/paycrest-beta-logo-black.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'bonadocs',
        path: 'bonadocs',
        routeBasePath: 'bonadocs',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
  ],
};
