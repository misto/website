export type Quote = {
  text: string;
  author: string;
  jobTitle: string;
  company?: string;
  link?: {
    href: string;
    text: string;
  };
  companyLogo:
    | {
        src: string;
        alt: string;
      }
    | any;
  img?: {
    src: string;
    alt: string;
    square?: boolean;
  };
};
