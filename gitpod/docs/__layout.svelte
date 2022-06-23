<script context="module">
  export const load = async ({ fetch, url }) => {
    const slug = url.pathname.replace(/\//g, "__");
    const res = await fetch(`/api/${slug}.docs.json`);

    const sidebars = Object.entries(
      import.meta.globEager("/src/lib/contents/docs/sidebars/*.ts")
    ).reduce((acc, [path, data]) => {
      const filename = path
        .split("/")
        .pop()
        .replace(/\.ts$/, "")
        .replace(/\./g, "-");

      const sidebar = MENU.map((item) => {
        if (item.title === "Self-Hosted") {
          item = { ...data.MENU };
        }
        return item;
      });
      acc[filename] = sidebar;
      return acc;
    }, {});

    try {
      const data = await res.clone().json();
      return { props: { docsMeta: data, sidebars } };
    } catch (e) {
      return {
        error: e,
      };
    }
  };
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import "$lib/assets/markdown-commons.scss";
  import EditInGitpod from "$lib/components/docs/edit-in-gitpod.svelte";
  import Menu from "$lib/components/docs/menu.svelte";
  import MobileMenu from "$lib/components/docs/mobile-menu/index.svelte";
  import Search from "$lib/components/docs/search.svelte";
  import OnThisPageNav from "$lib/components/navigation/on-this-page-nav.svelte";
  import { MENU } from "$lib/contents/docs/menu";
  import { releases } from "$lib/contents/docs/releases";
  import displayBanner from "$lib/stores/display-banner";
  import { docsMeta as docsMetaStore } from "$lib/stores/docs-meta";
  import sidebarStore from "$lib/stores/docs-sidebar";
  import type { DocsMeta } from "$lib/types/docs-meta";
  import type { MenuEntry } from "$lib/types/menu-entry.type";
  import { onMount } from "svelte";
  import VersionSwitch from "$lib/components/docs/version-switch.svelte";

  let extendSticky: boolean = false;
  export let sidebars: { [key: string]: MenuEntry[] };

  let version: string = releases[0].name.replace(/\./g, "-");

  $: activeSidebar = sidebars[version];

  $: {
    $sidebarStore = activeSidebar;
  }

  onMount(() => {
    extendSticky = $displayBanner;
  });
  export let docsMeta: DocsMeta;

  $: docsMetaStore.set(docsMeta);
</script>

<style lang="postcss">
  .extended-sticky {
    @apply top-24;
  }
</style>

<div class="pb-10 lg:flex lg:pt-10">
  <div
    class:extended-sticky={extendSticky}
    class="hidden z-20 sticky top-24 self-start lg:block lg:w-1/5"
  >
    {#if $page.url.pathname.includes("/docs/self-hosted")}
      <VersionSwitch {version} />
    {/if}
    <Search docSearchInputSelector="algolia-mobile" />

    <Menu MENU={activeSidebar} />
  </div>
  <div class="lg:w-3/5 lg:pl-4">
    <div class="block lg:hidden">
      <Search />
      {#if $page.url.pathname.includes("/docs/self-hosted")}
        <VersionSwitch {version} />
      {/if}
    </div>
    <MobileMenu MENU={activeSidebar} />
    <div class="lg:border-l lg:border-r lg:border-divider">
      <slot />
    </div>
  </div>
  <div
    class:extended-sticky={extendSticky}
    class="lg:w-1/5 flex-col top-24 self-start sticky gap-4 pl-8 hidden lg:flex max-w-none flex-auto min-w-0"
  >
    <div class="lg:mb-4">
      <EditInGitpod />
    </div>
    <OnThisPageNav />
  </div>
</div>
