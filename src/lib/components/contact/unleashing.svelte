<script lang="ts">
  import { brands, fourGeeks, jetbrains } from "$lib/contents/home/index";
</script>

<style lang="postcss">
  div {
    place-items: center;
    @apply grid-cols-2;

    @media (min-width: 425px) {
      @apply grid-cols-3;
    }

    @media (min-width: 1024px) {
      @apply grid-cols-2;
    }

    @media (min-width: 1280px) {
      @apply grid-cols-3;
    }
  }
</style>

<section class="my-small lg:my-0 lg:ml-12 lgx:ml-16 2xl:ml-20">
  <h2 class="h5 text-center">Unleashing developer teams&nbsp;at</h2>
  <div class="grid max-w-md mx-auto gap-x-small gap-y-8 mt-x-small">
    {#each [...brands, fourGeeks, jetbrains] as brand}
      <svelte:component
        this={brand.logo}
        class="max-h-[40px] w-24"
        transform={brand.transform}
      />
    {/each}
  </div>
</section>
