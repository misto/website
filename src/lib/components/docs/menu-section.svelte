<script lang="ts">
  import docsCurrentSectionStore from "$lib/stores/docs-current-section";
  import MenuLink from "./menu-link.svelte";

  import type { MenuEntry } from "$lib/types/menu-entry.type";
  import Pill from "$lib/components/pill.svelte";

  export let menuItem: MenuEntry;

  $: isActiveSection = $docsCurrentSectionStore
    ? menuItem.path.indexOf(
        /self-hosted\/\d\.\d\.\d/.test($docsCurrentSectionStore)
          ? $docsCurrentSectionStore.replace(/\d\.\d\.\d/, "latest")
          : $docsCurrentSectionStore
      ) >= 0
    : /\/docs\/?$/.test(menuItem.path);
</script>

<style lang="postcss">
  .isActiveSection {
    @apply py-6 bg-white rounded-2xl shadow-normal;
  }
</style>

<li data-analytics={`{"position":"sidebar"}`}>
  <div
    class:isActiveSection
    class="px-6 inline-block text-p-large leading-x-small"
  >
    <MenuLink href={menuItem.path} class="text-large">{menuItem.title}</MenuLink
    >
    {#if menuItem.subMenu && isActiveSection}
      <ul class="ml-4 mt-4 text-p-medium leading-x-small">
        {#each menuItem.subMenu as sub}
          <li
            class="flex flex-row items-center"
            data-analytics={`{"context":"submenu"}`}
          >
            {#if !sub.isSubeMenuCategoryHeader}
              <MenuLink href={sub.path}>{sub.title}</MenuLink>
            {:else}
              <div class="text-p-medium"><b>{sub.title}</b></div>
            {/if}
            {#if sub.status}
              <Pill
                text={sub.status}
                variant={sub.status === "soon" ? "pink" : "orange"}
                class="ml-1.5"
              />
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</li>
