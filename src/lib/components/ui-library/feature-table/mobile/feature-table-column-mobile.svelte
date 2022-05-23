<script lang="ts">
  import FeatureTableItemMobile from "./feature-table-item-mobile.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";
  import Card from "$lib/components/ui-library/card";
  import FeatureTableHeaderMobile from "./feature-table-header-mobile.svelte";
  import type {
    FeatureTableColumn,
    FeatureTableToc,
  } from "../feature-table.types";
  export let tocData: FeatureTableToc[];

  export let featureData: FeatureTableColumn;

  const items = featureData.items.map((item, index) => {
    return { ...item, ...tocData[index] };
  });
  let isShown: boolean = false;
</script>

<Card
  size="small"
  class="p-x-small max-w-[400px] mx-auto"
  brandShadow={featureData.isHighlighted}
>
  <FeatureTableHeaderMobile headerData={featureData.header} bind:isShown>
    {#if isShown}
      <section
        class="grid grid-cols-1 auto-rows-[4rem] gap-8 pt-4 mb-4 inner-grid-mobile"
      >
        {#each items as item}
          <FeatureTableItemMobile definition={item} />
        {/each}
        {#if featureData.link}
          <div class="flex justify-center items-center">
            <LinkButton
              size="large"
              href={featureData.link.href}
              variant={featureData.isHighlighted ? "primary" : "cta"}
              >{featureData.link.label}</LinkButton
            >
          </div>
        {/if}
      </section>
    {/if}
  </FeatureTableHeaderMobile>
</Card>
