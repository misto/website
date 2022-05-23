export type DocsMeta = {
  section: string;
  title: string;
  lastEdited: number;
  headings?: MarkdownHeader[];
};
export type MarkdownHeader = {
  title: string;
  slug: string;
  level: number;
  children: MarkdownHeader[];
};
