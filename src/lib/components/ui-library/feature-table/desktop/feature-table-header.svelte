<script lang="ts">
  import type { FeatureTableHeader } from "../feature-table.types";

  export let isToc: boolean = false;
  export let headerData: FeatureTableHeader = { headline: "" };
</script>

<div class="h-36 flex flex-col justify-center items-center space-y-4">
  {#if !isToc}
    {#if headerData.image && headerData.image.path}
      <img
        src={headerData.image.path}
        alt={headerData.image.alt}
        class="h-10"
      />
    {:else}
      <svelte:component this={headerData.image} class="h-10" />
    {/if}
    <div class="text-center">
      <h3>{@html headerData.headline}</h3>
      {#if headerData.subtitle}
        <p>{headerData.subtitle}</p>
      {/if}
    </div>
  {/if}
</div>
