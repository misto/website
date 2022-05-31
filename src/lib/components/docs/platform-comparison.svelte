<script lang="ts">
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
    },
    {
      mobileTitle: "Azure",
      title: "Microsoft Azure",
      value: 3,
      slotName: "azure",
    },
  ];
  let activeValue = 1;

  const clickHandler = (tabValue: number) => () => (activeValue = tabValue);
</script>

<style lang="postcss">
  .active {
    @apply bg-white;
  }
  .box {
    @apply px-4 py-2 rounded-b-2xl rounded-tr-2xl bg-white border-t-0;
  }

  li {
    @apply before:hidden m-0 p-0 !important;
  }
</style>

<div class="my-8">
  <ul class="flex flex-wrap !pl-0 !mb-0">
    {#each items as item}
      {#if Object.keys($$slots).includes(item.slotName)}
        <li class="!before:hidden">
          <span
            class="rounded-t-2xl cursor-pointer px-4 py-2 hidden md:block {activeValue ===
            item.value
              ? 'active'
              : ''} bg-sand-dark transition-all duration-200"
            on:click={clickHandler(item.value)}>{item.title}</span
          >
          <span
            class="rounded-t-2xl cursor-pointer px-4 py-2 md:hidden block {activeValue ===
            item.value
              ? 'active'
              : ''} bg-sand-dark transition-all duration-200"
            on:click={clickHandler(item.value)}>{item.mobileTitle}</span
          >
        </li>
      {/if}
    {/each}
  </ul>
  {#if $$slots.gcp}
    {#if activeValue === 1}
      <div class="box">
        <slot name="gcp" />
      </div>
    {/if}
  {/if}
  {#if $$slots.aws}
    {#if activeValue === 2}
      <div class="box">
        <slot name="aws" />
      </div>
    {/if}
  {/if}
  {#if $$slots.azure}
    {#if activeValue === 3}
      <div class="box">
        <slot name="azure" />
      </div>
    {/if}
  {/if}
</div>
