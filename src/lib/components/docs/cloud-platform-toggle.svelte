<script lang="ts">
  // Couldn't create this component entirely dynamic, because Slots can't be named dynamically
  // Had to use !important to make sure the styles from tailwinds prose-class are overridden
  import type { comparisonItem } from "$lib/types/docs.type";

  export let items: comparisonItem[] = [
    {
      mobileTitle: "GCP",
      title: "Google Cloud Platform (GCP)",
      value: 1,
      slotName: "gcp",
    },
    {
      mobileTitle: "AWS",
      title: "Amazon Web Services (AWS)",
      value: 2,
      slotName: "aws",
      hidden: true, // hidden since it is not ready to publish yet
    },
    {
      mobileTitle: "Azure",
      title: "Microsoft Azure",
      value: 3,
      slotName: "azure",
      hidden: true, // hidden since it is not ready to publish yet
    },
  ];
  let activeValue = 1;

  const clickHandler = (tabValue: number) => () => (activeValue = tabValue);

  let ariaIds: any = { tab: {}, tabpanel: {} };

  if (!globalThis.counter) {
    globalThis.counter = { tab: 1, tabpanel: 1 };
  }

  const getUnusedId = (() => {
    //@ts-ignore
    let { counter } = globalThis;
    return (name: string, role: "tab" | "tabpanel") => {
      const theId = `${role}-${counter[role]++}`;
      ariaIds[role][name] = theId;
      return theId;
    };
  })();

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
      case "Home":
        e.preventDefault();
        activeValue = switchableIndexes[0];
        break;
      case "End":
        e.preventDefault();
        activeValue = switchableIndexes[switchableIndexes.length - 1];
        break;
    }
  };

  export let id = "ide-toggle";

  export let open = false;
</script>

<style lang="postcss">
  .box {
    @apply px-4 py-4 rounded-b-2xl rounded-tr-2xl border-t-0;
  }

  li {
    @apply before:hidden m-0 p-0 !important;
  }
</style>

<details open={open || null} {id}>
  <summary class="text-p-medium">Cloud provider specific instructions</summary>

  <div class="my-8 mt-0">
    <ul
      class="flex flex-wrap !pl-0 !mb-0"
      role="tablist"
      on:keydown={switchHandler}
    >
      {#each items as item}
        {#if Object.keys($$slots).includes(item.slotName) && !item.hidden}
          <li
            class="!before:hidden"
            role="tab"
            aria-selected={item.value === activeValue}
            aria-controls={ariaIds.tabpanel[item.slotName]}
            tabindex={item.value === activeValue ? 0 : -1}
            on:click={clickHandler(item.value)}
            on:focus={clickHandler(item.value)}
            id={getUnusedId(item.slotName, "tab")}
          >
            <span
              class="rounded-t-2xl cursor-pointer px-4 py-2 hidden md:block {activeValue ===
              item.value
                ? 'bg-white dark:bg-card'
                : 'bg-sand-dark'} transition-all duration-200"
              on:click={clickHandler(item.value)}>{item.title}</span
            >
            <span
              class="rounded-t-2xl cursor-pointer px-4 py-2 md:hidden block {activeValue ===
              item.value
                ? 'bg-white dark:bg-card'
                : 'bg-sand-dark'} transition-all duration-200"
              on:click={clickHandler(item.value)}>{item.mobileTitle}</span
            >
          </li>
        {/if}
      {/each}
    </ul>
    {#if $$slots.gcp}
      <article
        class={`box bg-white dark:bg-card ${activeValue !== 1 ? "hidden" : ""}`}
        {...activeValue !== 1
          ? { hidden: true, "aria-hidden": "true", tabindex: -1 }
          : { hidden: false, "aria-hidden": "false", tabindex: 0 }}
        aria-labelledby={ariaIds?.tab?.gcp}
        id={getUnusedId("gcp", "tabpanel")}
        role="tabpanel"
      >
        <slot name="gcp" />
      </article>
    {/if}
    {#if $$slots.aws}
      <article
        class={`box bg-white dark:bg-card ${activeValue !== 2 ? "hidden" : ""}`}
        {...activeValue !== 2
          ? { hidden: true, "aria-hidden": "true", tabindex: -1 }
          : { hidden: false, "aria-hidden": "false", tabindex: 0 }}
        aria-labelledby={ariaIds?.tab?.aws}
        id={getUnusedId("aws", "tabpanel")}
        role="tabpanel"
      >
        <slot name="aws" />
      </article>
    {/if}
    {#if $$slots.azure}
      <article
        class={`box bg-white dark:bg-card ${activeValue !== 3 ? "hidden" : ""}`}
        {...activeValue !== 3
          ? { hidden: true, "aria-hidden": "true", tabindex: -1 }
          : { hidden: false, "aria-hidden": "false", tabindex: 0 }}
        aria-labelledby={ariaIds?.tab?.azure}
        id={getUnusedId("azure", "tabpanel")}
        role="tabpanel"
      >
        <slot name="azure" />
      </article>
    {/if}
  </div>
</details>
