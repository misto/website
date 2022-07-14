<script lang="ts">
  import type { Card as CardProps } from "$lib/types/card.type";
  import Card from "./card/card.svelte";

  export let benefits: CardProps[];
</script>

<div class="flex justify-center flex-wrap gap-micro">
  {#each benefits as card}
    <Card
      headingLevel="h2"
      class="flex items-center w-[270px] sm:w-[296px] sm:px-12"
      titleClassNames="h2"
      {card}
    />
  {/each}
</div>
