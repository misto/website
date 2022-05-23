<script lang="ts">
  import type { Pricing } from "$lib/types/pricing.type";
  import QaTooltip from "../qa-tooltip.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";
  import Card from "$lib/components/ui-library/card";

  export let pricing: Pricing;
  const {
    title,
    duration,
    features,
    price,
    btnHref,
    btnText,
    spiced,
    learnMoreHref,
    footnote,
    trackingName,
  } = pricing;
</script>

<style lang="postcss">
  .h1 {
    margin-bottom: 0.25rem;
  }

  li::before {
    content: url("/tick.svg");
    @apply absolute inline-block -left-7 sm:-left-9;
    height: 1.375rem;
    width: 1.375rem;

    @media (max-width: 375px) {
      @apply h-5 w-5;
    }
  }

  .learn-more {
    @apply underline;
  }

  :global(.crossed-out) {
    @apply line-through;
  }

  :global(.price-small),
  :global(.crossed-out) {
    @apply text-body text-h4 mr-macro;
  }
</style>

<Card
  size="small"
  class="box flex w-full max-w-xs sm:w-[320px] gap-small {spiced
    ? 'pt-xx-small'
    : 'pt-x-small'} pb-small flex-col justify-between items-center bg-card px-0 mt-0 mx-macro mb-x-small text-center transition-all duration-200"
  brandShadow={spiced}
  stroked={false}
>
  <div class="flex flex-col">
    {#if spiced}
      <div
        class="text-xs bg-black dark:bg-light-black text-white py-1 rounded-2xl w-28 mx-auto mb-macro shadow-light dark:shadow-none"
      >
        Most Popular
      </div>
    {/if}
    <h2 class="h4 !mb-0">{title}</h2>
    <div
      class="h2 font-bold text-important flex items-center justify-center mt-macro"
    >
      {@html price}
    </div>
    <div class="text-sub font-semibold mt-1">
      {#if duration}
        {duration}
      {:else}
        <span>&nbsp;</span>
      {/if}
    </div>
    {#if features}
      <ul
        class="inline-flex flex-col ml-x-small mt-xx-small space-y-micro text-left"
      >
        {#each features as feature}
          <li class="relative inline-flex text-important">
            {#if typeof feature !== "string"}
              <QaTooltip text={feature.text} tooltip={feature.tooltip} />
            {:else}
              {feature}
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    {#if learnMoreHref}
      <div class="flex flex-1 justify-center items-center">
        <a href={learnMoreHref} class="learn-more">Learn More</a>
      </div>
    {/if}
  </div>
  {#if btnHref && btnText}
    <LinkButton
      variant={spiced ? "primary" : "cta"}
      size="large"
      href={btnHref}
      data-analytics={`{"context":"` + trackingName + `","position":"hero"}`}
      >{btnText}</LinkButton
    >
  {/if}
  {#if footnote}
    <div class="text-p-xsmall px-small text-body">{footnote}</div>
  {/if}
</Card>
