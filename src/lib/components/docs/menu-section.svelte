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

<li data-analytics={`{"position":"sidebar"}`}>
  <div class="px-6 inline-block text-sm leading-6">
    <MenuLink
      href={menuItem.path}
      class={isActiveSection ? "text-black dark:text-white font-semibold" : ""}
      >{menuItem.title}</MenuLink
    >
    {#if menuItem.subMenu && isActiveSection}
      <ul
        class="ml-2 border-l mt-2 space-y-6 lg:space-y-2 border-divider leading-6"
      >
        {#each menuItem.subMenu as sub}
          <li
            class="flex flex-row items-center"
            data-analytics={`{"context":"submenu"}`}
          >
            <MenuLink href={sub.path}>{sub.title}</MenuLink>
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
