<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;

  $: normalizedPath = /self-hosted\/\d\.\d\.\d/.test($page.url.pathname)
    ? $page.url.pathname.replace(/\d\.\d\.\d/, "latest")
    : $page.url.pathname;
  $: active = href === normalizedPath || href === `${normalizedPath}/`;
</script>

<style lang="postcss">
  .active {
    @apply border-current font-semibold text-secondary;
  }
</style>

<a
  class:active
  class="block border-l pl-4 -ml-px border-transparent dark:hover:border-divider-light hover:border-light-black"
  {href}
  sveltekit:prefetch
  {...$$props}><slot /></a
>
