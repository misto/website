<script lang="ts">
  export let href: string;
  export let icon: string;
</script>

<style lang="postcss">
  a,
  span {
    /* Move to markup once src/lib/assets/markdown-commons.scss is gone */
    @apply leading-4;
  }

  :global(body.dark) .link-icon-external {
    img {
      filter: invert(80%) grayscale(80%);
      @apply transition-all duration-200;
    }

    &:hover img {
      filter: none;
    }
  }
</style>

<a
  class="link-icon-external inline-flex text-center py-2 px-4 text-btn-small leading-4 rounded-xl shadow-light dark:shadow-none font-semibold bg-card text-important hover:bg-tertiary focus:bg-tertiary dark:hover:bg-quaternary dark:hover:text-black"
  {href}
  target="_blank"
  rel="noopener"
  ><span class="">{icon}</span>
  <img
    class="inline-block my-0 mx-2 h-3 w-3"
    src="/svg/external.svg"
    alt="External"
  /><slot /></a
>
