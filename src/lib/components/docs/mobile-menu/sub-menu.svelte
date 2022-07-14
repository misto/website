<script lang="ts">
  // Components
  import MenuItem from "./menu-item.svelte";
  import Pill from "$lib/components/pill.svelte";

  // States
  import topicsState from "../states/topics-state";
  let subMenuState: boolean = false;

  import type { MenuEntry } from "$lib/types/menu-entry.type";
  import Arrow from "$lib/components/svgs/arrow.svelte";
  export let currentSection: MenuEntry = null;
  export let displayNavigation: boolean = true;
</script>

<style lang="scss">
  .back-button {
    line-height: 138%;
  }

  .back-button__icon {
    flex: 0 0 auto;
    margin-right: 1rem;
  }

  .back-button__icon-arrow {
    transform: rotate(90deg);
  }

  .sub-menu-container {
    margin-top: 1rem;
    border-radius: 0.75rem;
    box-shadow: var(--shadow);
  }

  .toggle-button {
    display: flex;
    align-items: center;
    padding: 0.8125rem 1rem;
    line-height: 138%;
    color: var(--black);
  }

  .toggle-button__label {
    flex: 1 1 auto;
    margin-right: 1rem;
    text-align: left;
  }

  .toggle-button__icon {
    flex: 0 0 auto;
  }

  .toggle-button__icon-arrow.open {
    transform: rotate(180deg);
  }
</style>

{#if displayNavigation}
  <button
    class="back-button flex items-center text-important w-full py-3"
    type="button"
    on:click={() => {
      $topicsState = true;
      subMenuState = false;
    }}
  >
    <div class="back-button__icon">
      <Arrow width="12" height="12" class="rotate-90" />
    </div>
    All topics
  </button>
{/if}
{#if currentSection?.subMenu}
  <div class="sub-menu-container bg-card">
    <button
      class="toggle-button w-full"
      type="button"
      aria-controls="sub-menu"
      aria-expanded={subMenuState}
      on:click={() => (subMenuState = !subMenuState)}
    >
      <div class="toggle-button__label text-important">
        {currentSection?.title}
      </div>
      <div class="toggle-button__icon">
        <Arrow
          class={subMenuState ? "rotate-180" : ""}
          height="15"
          width="15"
        />
      </div>
    </button>

    <div
      aria-label={currentSection?.title}
      role="navigation"
      class={`px-4 ${subMenuState ? "block" : "hidden"}`}
      id="sub-menu"
    >
      <ul class="divide-y divide-divider">
        {#each currentSection?.subMenu as sub}
          <MenuItem href={sub.path} onClick={() => (subMenuState = false)}>
            {sub.title}
            {#if sub.status}
              <Pill
                variant={sub.status === "soon" ? "pink" : "orange"}
                text={sub.status}
                class="ml-1.5"
              />
            {/if}
          </MenuItem>
        {/each}
      </ul>
    </div>
  </div>
{/if}
