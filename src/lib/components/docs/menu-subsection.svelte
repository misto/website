<script lang="ts">
  import docsCurrentSubsectionStore from "$lib/stores/docs-current-subsection";
  import type { MenuEntry } from "$lib/types/menu-entry.type";
  import { sanitizeSelfHosted } from "$lib/utils/helpers";
  import Pill from "../pill.svelte";
  import MenuLink from "./menu-link.svelte";
  export let menuItem: MenuEntry;

  function findSubSection(section: MenuEntry, currentSubSection: string) {
    if (currentSubSection) {
      const split = section.path.split("/");
      const result = split.includes(sanitizeSelfHosted(currentSubSection));
      return result;
    } else {
      return /\/docs$/.test(section.path);
    }
  }

  $: isActiveSubSection = findSubSection(menuItem, $docsCurrentSubsectionStore);
</script>

<li class="flex flex-row items-center" data-analytics={`{"context":"submenu"}`}>
  <div class="text-sm leading-6">
    <div class="inline-flex items-center">
      <MenuLink
        class="{isActiveSubSection
          ? 'text-black dark:text-white font-semibold'
          : ''} block border-l pl-4 -ml-px border-transparent dark:hover:border-divider-light hover:border-light-black"
        href={menuItem.path}>{menuItem.title}</MenuLink
      >
      {#if menuItem.status}
        <Pill
          text={menuItem.status}
          variant={menuItem.status === "soon" ? "pink" : "orange"}
          class="ml-1.5"
        />
      {/if}
    </div>
    {#if menuItem.subMenu && menuItem.subMenu.length > 0 && isActiveSubSection}
      <ul class="mt-2 space-y-6 lg:space-y-2 border-divider leading-6">
        {#each menuItem.subMenu as subsub}
          <li
            class="flex flex-row items-center"
            data-analytics={`{"context":"submenu"}`}
          >
            <MenuLink subMenu={true} href={subsub.path}>{subsub.title}</MenuLink
            >
            {#if subsub.status}
              <Pill
                text={subsub.status}
                variant={subsub.status === "soon" ? "pink" : "orange"}
                class="ml-1.5"
              />
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</li>
