<script lang="ts">
  let clazz = "";
  export { clazz as class };
  export let text: string;
  export let variant: "pink" | "orange" = "orange";
  const capitalised = text.charAt(0).toUpperCase() + text.slice(1);
</script>

<style lang="postcss">
  .pink {
    @apply bg-salmon;
  }

  .orange {
    @apply bg-tertiary;
  }
</style>

<div
  class="inline-block px-3 py-0.5 text-xs font-semibold text-important dark:text-black rounded-lg shadow-light {clazz} {variant}"
>
  {capitalised}
</div>
