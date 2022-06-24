<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import { releases } from "$lib/contents/docs/releases";

  export const prerender = true;

  export const load: Load = async ({ url }) => {
    const latestRelease = releases.map((release) => {
      return {
        ...release,
        name: release.name,
      };
    })[0];

    const split = url.pathname.split("/");
    split[3] = latestRelease.name;
    return {
      status: 301,
      redirect: split.join("/"),
    };
  };
</script>
