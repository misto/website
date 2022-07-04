<script lang="ts">
  // Couldn't create this component entirely dynamic, because Slots can't be named dynamically
  // Had to use !important to make sure the styles from tailwinds prose-class are overridden
  import type { comparisonItem } from "$lib/types/docs.type";

  export let items: comparisonItem[] = [
    {
      mobileTitle: "VS Code Web",
      title: "VS Code Browser",
      value: 1,
      slotName: "vscodebrowser",
    },
    {
      mobileTitle: "VS Code",
      title: "VS Code Desktop",
      value: 2,
      slotName: "vscodedesktop",
    },
    {
      mobileTitle: "JetBrains",
      title: "JetBrains",
      value: 3,
      slotName: "jetbrains",
    },
    {
      mobileTitle: "Command Line",
      title: "Command Line",
      value: 4,
      slotName: "commandline",
    },
  ];
  let activeValue = 1;

  const clickHandler = (tabValue: number) => () => (activeValue = tabValue);

  const switchableIndexes = items
    .filter((item) => Object.keys($$slots).includes(item.slotName))
    .map((item) => item.value);

  const switchHandler = (e: KeyboardEvent) => {
    const currentIndex = switchableIndexes.indexOf(activeValue);
    //@ts-ignore
    const siblings = e.target.parentElement.children;
    switch (e.code) {
      case "ArrowRight":
        {
          e.preventDefault();
          const willOverflow = currentIndex === switchableIndexes.length - 1;
          activeValue = willOverflow
            ? switchableIndexes[0]
            : switchableIndexes[currentIndex + 1];
          siblings[willOverflow ? 0 : currentIndex + 1].focus();
        }
        break;
      case "ArrowLeft":
        {
          e.preventDefault();
          const willOverflow = currentIndex === 0;
          activeValue = willOverflow
            ? switchableIndexes[switchableIndexes.length - 1]
            : switchableIndexes[currentIndex - 1];
          siblings[
            willOverflow ? switchableIndexes.length - 1 : currentIndex - 1
          ].focus();
        }
        break;
    }
  };

  export let id = "ide-toggle";
</script>

<style lang="postcss">
  .box {
    @apply px-4 py-4 rounded-b-2xl rounded-tr-2xl border-t-0;
  }

  li {
    @apply before:hidden m-0 p-0 !important;
  }
</style>

<div class="my-8 mt-0">
  <header>
    <nav>
      <ul
        class="flex flex-wrap !pl-0 !mb-0"
        role="tablist"
        on:keydown={switchHandler}
      >
        {#each items as item}
          {#if Object.keys($$slots).includes(item.slotName)}
            <li
              class="!before:hidden"
              role="tab"
              aria-selected={item.value === activeValue}
              tabindex="0"
              on:click={clickHandler(item.value)}
              on:focus={clickHandler(item.value)}
            >
              <span
                class="rounded-t-2xl cursor-pointer px-4 py-2 hidden md:block {activeValue ===
                item.value
                  ? 'bg-white dark:bg-card'
                  : 'bg-sand-dark dark:bg-light-black'} transition-all duration-200"
                >{item.title}</span
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
    </nav>
  </header>
  {#if $$slots.vscodebrowser}
    {#if activeValue === 1}
      <article class="box bg-white dark:bg-card" role="tabpanel">
        <slot name="vscodebrowser" />
      </article>
    {/if}
    {#if $$slots.vscodedesktop}
      {#if activeValue === 2}
        <article class="box bg-white dark:bg-card" role="tabpanel">
          <slot name="vscodedesktop" />
        </article>
      {/if}
    {/if}
  {/if}
  {#if $$slots.jetbrains}
    {#if activeValue === 3}
      <article class="box bg-white dark:bg-card" role="tabpanel">
        <slot name="jetbrains" />
      </article>
    {/if}
  {/if}
</div>
