<script lang="ts">
  import FeatureTableHeader from "./feature-table-header.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";
  import FeatureTableItem from "./feature-table-item.svelte";
  import type { FeatureTableColumn } from "../feature-table.types";
  import Card from "$lib/components/ui-library/card";

  export let featureData: FeatureTableColumn;
</script>

<Card size="small" class="p-4" brandShadow={featureData.isHighlighted}>
  <FeatureTableHeader headerData={featureData.header} />
  <section
    class="grid grid-cols-1 auto-rows-[3.75rem] border-t-2 border-divider pt-4 inner-grid-desktop"
  >
    {#each featureData.items as item}
      <FeatureTableItem definition={item} />
    {/each}
    {#if featureData.link}
      <div class="flex justify-center items-start">
        <LinkButton
          variant={featureData.isHighlighted ? "primary" : "cta"}
          size="large"
          href={featureData.link.href}>{featureData.link.label}</LinkButton
        >
      </div>
    {/if}
  </section>
</Card>
