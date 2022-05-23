import type { Card } from "$lib/types/card.type";
import type { ExploreSection } from "$lib/types/explore-section.type";

export const benefits: Card[] = [
  {
    icon: {
      src: "/svg/icons/cloud.svg",
      alt: "Cloud",
    },
    title: "Opportunities to grow",
    text: "We promise you a safe space to improve your coding, content creation or even public speaking skills.",
  },
  {
    icon: {
      src: "/svg/icons/team.svg",
      alt: "People",
    },
    title: "Build a network",
    text: "Build your network with our thriving community, connect with and learn from like-minded people.",
  },
  {
    icon: {
      src: "/svg/icons/heart.svg",
      alt: "Heart",
    },
    title: "Recognition",
    text: "Associate yourself with our brand and become one of our community moderators on Discord.",
  },
  {
    icon: {
      src: "/svg/icons/opensource.svg",
      alt: "Free OSS plan",
    },
    title: "Free OSS plan",
    text: "Enjoy free, unlimited hours on any public repository.",
  },
  {
    icon: {
      src: "/svg/icons/plus.svg",
      alt: "Plus",
    },
    title: "Extra resources",
    text: "Receive exclusive swag, access to resources to help you spread the word, content reviews from the Gitpod team,  and more!",
  },
  {
    icon: {
      src: "/svg/icons/tick.svg",
      alt: "Tick",
    },
    title: "Beta access",
    text: "Test new features before they are officially released and share your feedback with our product teams.",
  },
];

export const exploreContents: ExploreSection = {
  title: "Apply Now",
  description:
    "Join us empowering developers to make engineering collaborative and joyful again.",
  note: " Are you our next community hero?",
  link: { text: "Apply Now", href: "https://forms.gle/hPSZ2Bws9rpqE7M4A" },
  useKumquatIllustration: true,
};
