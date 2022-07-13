import type { Lottie } from "./lottie.type";

export type Feature = {
  title: string;
  paragraph: string;
  moreButton?: { text: string; href: string; type?: "secondary" | "tertiary" };
  secondaryButton?: { text: string; href: string };
  featureList?: string[];
  image?: {
    darkSrc?: string;
    src: string;
    alt: string;
    height?: number;
    width?: number;
    classNames?: string;
    styles?: string;
  };
  footnote?: string;
  terminal?: {
    source: string;
    skipToEnd?: boolean;
    shadow?: "grey" | "brand" | false;
    narrow?: boolean;
    dark?: boolean;
  };
  previewComponent?: any;
  lottie?: Lottie;
  showTheMediaFirstOnMobile?: boolean;
  headingLevel?: "h2" | "h3";
};

export type verticalFeature = {
  title: string;
  paragraph: string;
  previewComponent?: any;
};
