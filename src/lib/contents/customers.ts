import type { Feature } from "$lib/types/feature.type";
import type { Quote } from "$lib/types/quote.type";

export const benefits = [
  {
    title: "5h",
    text: "average weekly<br/>time saved per engineer",
  },
  {
    title: "4x",
    text: "faster code<br/>contribution of new hires",
  },
  {
    title: "5x",
    text: 'revenue growth compared to companies<br/>with low dev experience & velocity [<a href="https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/developer-velocity-how-software-excellence-fuels-business-performance" target="_blank">1</a>]',
  },
];

export const quotes: Quote[] = [
  {
    text: "Gitpod has been instrumental to our ability to scale so quickly",
    author: "François Ruty",
    jobTitle: "CTO at Shares.io",
    companyLogo: {
      src: "/images/customers/shares-io/logo.svg",
      alt: "Shares.io",
    },
    img: {
      src: "/images/customers/shares-io/quote.png",
      alt: "Shares.io",
    },
    link: {
      href: "/customers/shares-io",
      text: "View customer story",
    },
  },
  {
    text: "Gitpod will become the default way of developing. Local development is just not an option anymore.",
    author: "Konrad Mattheis",
    jobTitle: "CTO at Vizlib",
    companyLogo: {
      src: "/images/customers/vizlib/logo.svg",
      alt: "Vizlib",
    },
    img: {
      src: "/images/customers/vizlib/quote.png",
      alt: "Vizlib",
    },
    link: {
      href: "/customers/vizlib",
      text: "View customer story",
    },
  },
  {
    text: "Gitpod totally changed the development velocity for RedwoodJS—it removed any issues related to configurations of dev environments and made it incredibly easy to contribute.",
    author: "Tom Preston-Werner",
    jobTitle: "Founder of GitHub & Redwood, former CEO of GitHub",
    companyLogo: {
      src: "/images/customers/redwoodjs/logo.svg",
      alt: "Redwoodjs",
    },
    img: {
      src: "/images/customers/redwoodjs/quote.png",
      alt: "Shares.io",
    },
    link: {
      href: "/customers/redwoodjs",
      text: "View customer story",
    },
  },
];

export const developFeature: Feature = {
  title: "Develop like Google, Facebook or&nbsp;Shopify",
  paragraph:
    "What big tech companies are trying to build internally, Gitpod is bringing to the rest of the world: container-based development in the&nbsp;cloud.",
  image: {
    src: "/svg/customers/develop-like.svg",
    alt: "Develop like Google, Facebook or Shopify",
  },
};
