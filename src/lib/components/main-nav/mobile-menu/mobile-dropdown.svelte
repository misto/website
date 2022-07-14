<script lang="ts">
  import Arrow from "$lib/components/svgs/arrow.svelte";
  import { links } from "$lib/contents/dropdown";

  let shown: boolean = false;
</script>

<button
  class="flex items-center text-p-large text-left text-important hover:bg-sand-dark focus:bg-sand-dark dark:hover:bg-light-black dark:focus:bg-light-black"
  on:click={() => (shown = !shown)}
>
  Resources
  <Arrow
    class="ml-1.5 h-3 w-3 transform {shown ? 'rotate-180' : ''}"
    fillClass={shown ? "fill-important" : "fill-body"}
  />
</button>

{#if shown}
  <div class="flex flex-col text-p-large">
    {#each links as { href, text }}
      <a
        {href}
        class="py-macro no-underline text-important hover:bg-sand-dark focus:bg-sand-dark dark:hover:bg-light-black dark:focus:bg-light-black"
      >
        {text}
      </a>
    {/each}
  </div>
{/if}
