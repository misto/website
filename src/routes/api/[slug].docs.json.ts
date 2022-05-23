import type { RequestHandler } from "@sveltejs/kit";
import path from "path";
import fs from "fs";
import { compile } from "mdsvex";
import slug from "remark-slug";
import headings from "remark-autolink-headings";
import remarkExternalLinks from "remark-external-links";
import { h } from "hastscript";
import { toString } from "mdast-util-to-string";
import getHeadings from "$lib/utils/get-headings";
import remarkSetImagePath from "$lib/utils/remark-set-image-path.js";
import remarkEmbedVideo from "$lib/utils/remark-embed-video.js";
import remarkLinkWithImageAsOnlyChild from "$lib/utils/remark-link-with-image-as-only-child.js";
import remarkHeadingsPermaLinks from "$lib/utils/remark-headings-permalinks.js";

export const get: RequestHandler = async ({ params }) => {
  const title = slugToTitle(params.slug);
  const filePath = resolveFile(title);
  const lastEdited = fs.statSync(filePath).mtimeMs;
  const rawMarkdown = fs.readFileSync(filePath, "utf8");

  const compiledMarkdown = await compile(rawMarkdown, {
    remarkPlugins: [
      [
        remarkExternalLinks,
        {
          target: "_blank",
        },
      ],
      slug,
      [
        headings,
        {
          behavior: "append",
          linkProperties: {},
          content: function (node) {
            return [
              h("span.icon.icon-link", {
                ariaLabel: toString(node) + " permalink",
              }),
            ];
          },
        },
      ],
      remarkSetImagePath,
      remarkLinkWithImageAsOnlyChild,
      remarkHeadingsPermaLinks,
      getHeadings,
      [
        remarkEmbedVideo,
        {
          width: 800,
          height: 400,
          noIframeBorder: true,
        },
      ],
    ],
  });

  return {
    body: {
      ...compiledMarkdown.data.fm,
      lastEdited,
    },
  };
};

function slugToTitle(slug: string) {
  return slug.replace(/__/g, "/");
}

function resolveFile(fileName: string) {
  let result: string;
  const dir = path.join(process.cwd(), "src/routes/docs");
  const markdownFiles = getMarkdownFiles(dir);
  const filteredMatches = markdownFiles.filter((file) => {
    const parsedFileName = parseFileNameFromPath(fileName);
    const parsedfile = parseFileNameFromPath(file);
    const match =
      normalizeFileName(parsedFileName) === normalizeFileName(parsedfile);
    return match;
  });

  if (filteredMatches.length > 1) {
    result = filteredMatches.find((file) => {
      const match = file.includes(fileName);
      return match;
    });
  } else {
    result = filteredMatches[0];
  }

  if (!result) {
    result = markdownFiles.find((file) => {
      const parsedFilename = parseFileNameFromPath(fileName);
      const match = file.endsWith(`${parsedFilename}/index.md`);
      return match;
    });
  }
  return result;
}

function getMarkdownFiles(dir: string) {
  /** @type {any[]} */
  var results: string[] = [];
  const items = fs.readdirSync(dir);
  items.forEach((doc) => {
    doc = `${dir}/${doc}`;
    const stat = fs.statSync(doc);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(doc));
    } else {
      results.push(doc);
    }
  });
  return results.filter((f) => f.endsWith(".md"));
}

function parseFileNameFromPath(path: string): string {
  if (path.includes("/")) {
    const parsedFileFromPath = path.split("/")[path.split("/").length - 1];
    return parsedFileFromPath.replace(".md", "");
  } else {
    return null;
  }
}

function normalizeFileName(fileName: string): string {
  fileName = fileName
    .replace(".md", "")
    .replace("(", "")
    .replace(")", "")
    .split(" ")
    .join("-")
    .toLowerCase();

  return fileName;
}
