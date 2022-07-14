<script lang="ts">
  import Section from "../section.svelte";
  import Testimonial from "./testimonial.svelte";
  import type { Testimonial as TestimonialType } from "$lib/types/testimonial.type";
  import Carousel from "../carousel.svelte";

  export let testimonials: TestimonialType[];
  export let title: string = "";
  export let text: string = "";
  // const sequence: number[] = [];
  // export let isDirectionNegative: boolean = false;

  // for (let i = 0; i < testimonials.length; i += 3) {
  //   sequence.push(i);
  // }

  // let activeSequenceNumber = 0;

  let clazz = "";
  export { clazz as class };
</script>

<style lang="postcss">
  :global(.slides) {
    margin-bottom: var(--small);
  }

  :global(.slides) > :global(div) > :global(div) {
    display: flex;
    justify-content: center;
  }

  .active {
    @apply bg-sub dark:bg-divider;
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

    <Carousel>
      {#each testimonials as testimonial}
        <Testimonial {testimonial} />
      {/each}
    </Carousel>
    <!-- <div class="flex justify-center space-x-micro">
      {#each sequence as number}
        <button
          on:click={() => {
            isDirectionNegative = activeSequenceNumber > number;
            activeSequenceNumber = number;
          }}
          class="inline-block h-[15px] w-[15px] bg-divider dark:bg-light-black rounded-full transition-all duration-200"
          class:active={number === activeSequenceNumber}
        />
      {/each}
    </div> -->
  </div>
</Section>
