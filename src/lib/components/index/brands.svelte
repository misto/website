<script lang="ts">
  import Brand from "./brand.svelte";
  import type { Brand as BrandType } from "$lib/types/brand.type";

  export let brands: BrandType[];
  export let isCustomerStoriesLinkShown: boolean = true;
</script>

<style>
  .brands {
    max-width: 1130px;
  }
</style>

<div
  class="brands flex flex-wrap justify-center items-center mx-auto mt-x-small"
>
  {#each brands as brand}
    <div class="md:w-1/5">
      <Brand {brand} />
    </div>
  {/each}
</div>
{#if isCustomerStoriesLinkShown}
  <div class="mt-8">
    View&nbsp;
    <a href="/customers"><span class="underline">customer stories</span></a>
  </div>
{/if}
