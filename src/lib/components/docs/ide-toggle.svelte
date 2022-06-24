<script lang="ts">
  // Couldn't create this component entirely dynamic, because Slots can't be named dynamically
  // Had to use !important to make sure the styles from tailwinds prose-class are overridden
  import type { comparisonItem } from "$lib/types/docs.type";

  export let items: comparisonItem[] = [
    {
      mobileTitle: "JetBrains",
      title: "JetBrains",
      value: 1,
      slotName: "jetbrains",
    },
    {
      mobileTitle: "VS Code Browser",
      title: "VS Code Browser",
      value: 2,
      slotName: "vscodebrowser",
    },
    {
      mobileTitle: "VS Code Desktop",
      title: "VS Code Desktop",
      value: 3,
      slotName: "vscodedesktop",
    },
    {
      mobileTitle: "Command Line",
      title: "Command Line",
      value: 3,
      slotName: "commandline",
    },
  ];
  let activeValue = 1;

  const clickHandler = (tabValue: number) => () => (activeValue = tabValue);

  export let id = "ide-toggle";

  export let open = true;
</script>

<style lang="postcss">
  .box {
    @apply px-4 py-2 rounded-b-2xl rounded-tr-2xl border-t-0;
  }

  li {
    @apply before:hidden m-0 p-0 !important;
  }
</style>

<details open={open || null} {id}>
  <summary class="text-p-medium">
    Configuration for JetBrains, VS Code Desktop, VS Code
  </summary>

  <div class="my-8 mt-0">
    <ul class="flex flex-wrap !pl-0 !mb-0">
      {#each items as item}
        {#if Object.keys($$slots).includes(item.slotName)}
          <li class="!before:hidden">
            <span
              class="rounded-t-2xl cursor-pointer px-4 py-2 hidden md:block {activeValue ===
              item.value
                ? 'bg-white dark:bg-card'
                : 'bg-sand-dark dark:bg-light-black'} transition-all duration-200"
              on:click={clickHandler(item.value)}>{item.title}</span
            >
            <span
              class="rounded-t-2xl cursor-pointer px-4 py-2 md:hidden block {activeValue ===
              item.value
                ? 'bg-white dark:bg-card'
                : 'bg-sand-dark dark:bg-light-black'} transition-all duration-200"
              on:click={clickHandler(item.value)}>{item.mobileTitle}</span
            >
          </li>
        {/if}
      {/each}
    </ul>
    {#if $$slots.jetbrains}
      {#if activeValue === 1}
        <div class="box bg-white dark:bg-card">
          <slot name="jetbrains" />
        </div>
      {/if}
    {/if}
    {#if $$slots.vscodebrowser}
      {#if activeValue === 2}
        <div class="box bg-white dark:bg-card">
          <slot name="vscodebrowser" />
        </div>
      {/if}
    {/if}
    {#if $$slots.vscodedesktop}
      {#if activeValue === 3}
        <div class="box bg-white dark:bg-card">
          <slot name="vscodedesktop" />
        </div>
      {/if}
    {/if}
    {#if $$slots.commandline}
      {#if activeValue === 4}
        <div class="box bg-white dark:bg-card">
          <slot name="commandline" />
        </div>
      {/if}
    {/if}
  </div>
</details>
