<script lang="ts">
  import { page } from "$app/stores";

  export let navItem: any;
  const { href, highlight, label, isExternal } = navItem;
  const isPrefecthable = isExternal ? undefined : true;

  $: isActivePage =
    $page.url.pathname === "/"
      ? /\/$/.test(href)
      : href.indexOf($page.url.pathname) >= 0;
</script>

<style lang="postcss">
  a {
    @media (min-width: 1190px) {
      @apply text-base;
    }
  }

  .active {
    @apply text-important;
  }

  .highlight {
    @apply relative;
    &::after {
      content: url("/indicator.svg");
      @apply absolute -top-3 -right-2;
    }
  }
</style>

<a
  class:active={isActivePage && !isExternal}
  class:highlight
  {href}
  on:click
  on:focus
  sveltekit:prefetch={isPrefecthable}
  class="text-important sm:text-body text-p-large hover:text-important focus:text-important active:text-important"
>
  {label}
</a>
