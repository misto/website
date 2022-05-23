<script lang="ts">
  import type { Brand } from "$lib/types/brand.type";

  export let brand: Brand;

  const { logo, transform, className } = brand;
</script>

<style lang="postcss">
  .brand {
    @apply max-h-14;
    flex-basis: calc(14% - 1.375rem);
    min-width: 130px;
    display: flex;
    border: 2px solid transparent;
    justify-content: center;
    margin: 0.75rem;

    :global(.fcc) {
      @media (min-width: 841px) {
        width: 8.125rem !important;
        transform: translateX(-0.625rem);
      }
    }
  }
</style>

<div class="brand">
  <svelte:component
    this={logo}
    style={`transform: ${transform}; width: 5.9375rem; height: 100%;`}
    class={className}
  />
</div>
