import fs from "fs";
import type { ChangelogEntry as ChangelogEntryType } from "$lib/types/changelog-entry.type";

function renderRawMarkdown(data: ChangelogEntryType, md: string) {
  const { title, image, date, alt } = data;
  const mdContent = md
    .replace(/---.*?---/gms, "")
    .replace(/<script>.*?<\/script>/gms, "")
    .replace(/<Badge.*?text="(.*?)".*?\/>/gim, "`$1`")
    .replace(/<Contributors usernames="(.*?)" \/>/gim, (match, p1) => {
      const users = p1
        .split(",")
        .map((e: string) => `[${e}](https://github.com/${e})`);
      return `Contributors: ${users.join(", ")}`;
    })
    .replace(/<p>(.*?)<\/p>/gm, "$1")
    .replace(/^[\n]+/m, "");

  return `# ${title}

> See also https://gitpod.io/changelog

![${alt ?? "image"}](https://gitpod.io/images/changelog/${image})

${mdContent}
`;
}

export const get: import("@sveltejs/kit").RequestHandler = async ({
  url,
  locals,
}) => {
  const date = url.searchParams.get("date");
  const data = !date
    ? locals.changelogEntries[0]
    : locals.changelogEntries.find((e: ChangelogEntryType) =>
        e.date.startsWith(date)
      );
  if (!data) {
    return {
      status: 404,
      statusText: "Not Found",
    };
  }
  const content = fs
    .readFileSync(
      `./src/lib/contents/changelog/${data.date.substring(0, 10)}.md`
    )
    .toString();
  return {
    body: renderRawMarkdown(data, content),
  };
};
