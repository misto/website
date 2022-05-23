<script lang="ts">
  import { page } from "$app/stores";
  import LogoTextless from "../svgs/logo-textless.svelte";

  const BASE_PATH =
    "https://gitpod.io#https://github.com/gitpod-io/website/tree/main/src/routes";
  const currentPage =
    $page.url.pathname === "/docs"
      ? `${$page.url.pathname}/index`
      : $page.url.pathname;
  const href = `${BASE_PATH}${currentPage}.md`;
</script>

<style lang="postcss">
  .disable-filter {
    @apply after:filter-none !important;
  }
</style>

<div class="flex flex-shrink-0">
  <a
    {href}
    target="_blank"
    class="inline-flex stroked disable-filter after:dark:hover:bg-light-black after:filter-none py-macro px-4 items-center justify-center bg-bg dark:bg-card rounded-2xl text-btn-small text-important dark:text-white shadow-light dark:shadow-none font-semibold hover:bg-card focus:bg-card dark:hover:bg-light-black dark:focus:bg-light-black"
    rel="noopener"
    data-analytics={`{"variant":"open_in_gitpod"}`}
  >
    <span>
      <LogoTextless />
    </span> <span class="ml-macro">Edit in Gitpod</span>
  </a>
</div>
