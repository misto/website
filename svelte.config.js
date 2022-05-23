import adapterNetlify from "@sveltejs/adapter-netlify";
import { mdsvex } from "mdsvex";
import headings from "remark-autolink-headings";
import remarkExternalLinks from "remark-external-links";
import slug from "remark-slug";
import sveltePreprocess from "svelte-preprocess";
import remarkSetImagePath from "./src/lib/utils/remark-set-image-path.js";
import remarkEmbedVideo from "./src/lib/utils/remark-embed-video.js";
import remarkLinkWithImageAsOnlyChild from "./src/lib/utils/remark-link-with-image-as-only-child.js";
import remarkHeadingsPermaLinks from "./src/lib/utils/remark-headings-permalinks.js";
import { toString } from "mdast-util-to-string";
import { h } from "hastscript";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],

  kit: {
    trailingSlash: "never",
    adapter: adapterNetlify({
      split: true,
    }),
    amp: false,
    appDir: "_app",
    files: {
      assets: "static",
      hooks: "src/hooks",
      lib: "src/lib",
      routes: "src/routes",
      template: "src/app.html",
    },
    hydrate: true,
    prerender: {
      crawl: true,
      enabled: true,
      onError: "fail",
      entries: ["*"],
    },
    router: true,
    target: "#svelte",
    vite: {
      resolve: {
        preserveSymlinks: true,
      },
      server: {
        hmr: {
          clientPort: process.env.GITPOD_WORKSPACE_URL ? 443 : 3000,
          host: process.env.GITPOD_WORKSPACE_URL
            ? process.env.GITPOD_WORKSPACE_URL.replace("https://", "3000-")
            : "localhost",
        },
      },
    },
  },

  // options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
  preprocess: [
    sveltePreprocess({ postcss: true, scss: true, preserve: ["ld+json"] }),
    mdsvex({
      extensions: [".md"],
      layout: {
        blog: "./src/lib/components/blog/blog-content-layout.svelte",
        docs: "./src/lib/components/docs/docs-content-layout.svelte",
        guides: "./src/lib/components/guides/guides-content-layout.svelte",
        customers:
          "./src/lib/components/customers/customers-content-layout.svelte",
      },
      rehypePlugins: [],
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
                h("span.icon.icon-link header-anchor", {
                  ariaLabel: toString(node) + " permalink",
                }),
              ];
            },
          },
        ],
        remarkSetImagePath,
        remarkLinkWithImageAsOnlyChild,
        remarkHeadingsPermaLinks,
        [
          remarkEmbedVideo,
          {
            width: 800,
            height: 400,
            noIframeBorder: true,
          },
        ],
      ],
    }),
  ],
};

export default config;
