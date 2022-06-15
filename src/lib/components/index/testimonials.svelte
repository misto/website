<script lang="ts">
  import Section from "../section.svelte";
  import Testimonial from "./testimonial.svelte";
  import type { Testimonial as TestimonialType } from "$lib/types/testimonial.type";

  export let testimonials: TestimonialType[];
  export let title: string = "";
  export let text: string = "";
  const sequence: number[] = [];
  export let isDirectionNegative: boolean = false;

  for (let i = 0; i < testimonials.length; i += 3) {
    sequence.push(i);
  }

  let activeSequenceNumber = 0;

  let clazz = "";
  export { clazz as class };
</script>

<style lang="scss">
  :global(.slides) {
    margin-bottom: var(--small);
  }

  :global(.slides) > :global(div) > :global(div) {
    display: flex;
    justify-content: center;
  }
</style>

<Section class={clazz} {...$$restProps}>
  <div class="row">
    <div class="text-center">
      {#if title}
        <h2>{title}</h2>
      {/if}
      {#if text}
        <p class="text-large mt-xx-small mb-medium">
          {text}
        </p>
      {/if}
    </div>

    {#key activeSequenceNumber}
      <div class="flex justify-between max-w-[1200px] mx-auto h-[340px]">
        <Testimonial
          {isDirectionNegative}
          testimonial={testimonials[activeSequenceNumber]}
        />
        {#if testimonials[activeSequenceNumber + 1] !== undefined}
          <Testimonial
            {isDirectionNegative}
            testimonial={testimonials[activeSequenceNumber + 1]}
          />
        {/if}
        {#if testimonials[activeSequenceNumber + 2] !== undefined}
          <Testimonial
            {isDirectionNegative}
            testimonial={testimonials[activeSequenceNumber + 2]}
          />
        {/if}
      </div>
    {/key}
    <div class="flex justify-center space-x-2">
      {#each sequence as number}
        <button
          on:click={() => {
            console.log(activeSequenceNumber, number);
            isDirectionNegative = activeSequenceNumber > number;
            activeSequenceNumber = number;
          }}
          class="inline-block h-4 w-4 bg-divider-light dark:bg-light-black rounded-full"
        />
      {/each}
    </div>
  </div>
</Section>
